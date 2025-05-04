require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const tesseract = require('tesseract.js');
const mime = require('mime-types');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { exec } = require('child_process');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const History = require('./History');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

ffmpeg.setFfmpegPath(ffmpegPath);

// —————— Helpers ——————

function extractAudioFromVideo(videoPath) {
    const wavPath = videoPath + '.wav';
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .audioChannels(1)
            .audioFrequency(16000)
            .setDuration(60)
            .format('wav')
            .on('end', () => resolve(wavPath))
            .on('error', reject)
            .save(wavPath);
    });
}

async function processFile(filePath, mimetype) {
    if (mimetype.startsWith('text/')) {
        return fs.readFileSync(filePath, 'utf8');
    }
    if (mimetype.startsWith('image/')) {
        const { data: { text } } = await tesseract.recognize(filePath, 'eng');
        return text;
    }
    if (mimetype.startsWith('audio/') || mimetype.startsWith('video/')) {
        let audioPath = filePath;
        if (mimetype.startsWith('video/')) {
            audioPath = await extractAudioFromVideo(filePath);
            fs.unlinkSync(filePath);
        }
        return await new Promise((resolve, reject) => {
            exec(`python transcribe.py "${audioPath}"`, (err, stdout, stderr) => {
                if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
                if (err) {
                    console.error('Python error:', stderr || err);
                    return reject(err);
                }
                resolve(stdout.trim());
            });
        });
    }
    throw new Error('Unsupported file type');
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Missing token' });
    }

    jwt.verify(token, jwtSecret, (err, user) => {  // <-- FIXED SECRET NAME HERE
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// —————— App Setup ——————

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));

const upload = multer({ dest: 'uploads/' });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// —————— Routes ——————

app.get('/', (req, res) => res.send('Hashtag Generator API is running'));

app.post('/upload', upload.single('media'), async (req, res) => {
    let tempPath;
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'File upload is required' });
        }

        tempPath = req.file.path;
        const contentInput = await processFile(tempPath, req.file.mimetype);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);

        if (!contentInput || !contentInput.trim()) {
            return res.status(400).json({ message: 'No content extracted from file' });
        }

        res.json({ success: true, transcription: contentInput.trim() });

    } catch (err) {
        console.error('Error during /upload:', err);
        if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        res.status(500).json({ message: 'Error processing file', error: err.message });
    }
});

app.post('/api/generate', upload.single('media'), async (req, res) => {
    let tempPath;
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'File upload is required' });
        }

        tempPath = req.file.path;
        const contentInput = await processFile(tempPath, req.file.mimetype);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);

        if (!contentInput || !contentInput.trim()) {
            return res.status(400).json({ message: 'No content extracted from file' });
        }

        const prompt = `Generate 5 creative and relevant hashtags based on the following content: "${contentInput}"`;
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const gResp = await model.generateContent(prompt);
        const generatedText = gResp.response.text();

        const generatedHashtags = [...new Set(
            generatedText.trim().split(/[\n]+/).map(line => {
                const m = line.match(/(#[A-Za-z0-9_-]+)/);
                return m ? m[0] : '';
            }).filter(Boolean)
        )];

        await new History({ contentInput, generatedHashtags, sourceText: generatedText }).save();

        res.json({ generatedHashtags });

    } catch (err) {
        console.error('Error generating hashtags:', err);
        if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        res.status(500).json({ message: 'Error generating hashtags', error: err.message });
    }
});

app.get('/api/history', authenticateToken, async (req, res) => {
    try {
        const history = await History.find().sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        console.error('Error fetching history:', err);
        res.status(500).json({ message: 'Error fetching history', error: err.message });
    }
});

const User = require('./models/User');

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const user = new User({ username, password });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// —————— Start Server ——————
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
