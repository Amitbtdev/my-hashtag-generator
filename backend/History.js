const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    contentInput: { type: String, required: true },
    generatedHashtags: [{ type: String }],  // Ensures it's an array of strings
    sourceText: { type: String, required: true }
});

const History = mongoose.model('History', historySchema);

module.exports = History;
