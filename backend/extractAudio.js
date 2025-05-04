const { exec } = require('child_process');
const path = require('path');

function extractAudio(videoPath, outputAudioPath) {
    return new Promise((resolve, reject) => {
        const command = `ffmpeg -y -i "${videoPath}" -vn -acodec pcm_s16le -ar 44100 -ac 2 "${outputAudioPath}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`ffmpeg error: ${error.message}`);
                return reject(error);
            }
            resolve(outputAudioPath);
        });
    });
}

module.exports = extractAudio;
