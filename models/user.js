const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'please, enter a username']
    },
    email: {
        type: String,
        required: [true, 'please enter a password']
    },
    password: {
        type: String,
        required:[true, 'please, enter your password']
    },
    campus: {
        type: String
    },
    role: {
        type: String,
        required: true
    },
    file: String,
    finance: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Finance'
    }]
}, {timestamps: true});


module.exports = mongoose.model('User', UserSchema)