const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: String,
    email_Mittente: String,
    email_Destinatario: String,
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

module.exports = mongoose.model('Message', messageSchema);