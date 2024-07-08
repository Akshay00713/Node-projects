const { genSalt } = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // fullName: {
    //     type: String,
    //     required: true,
    // },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
});


userSchema.pre('save', async function(next) {
    if(!this.isModified(this.password)) return next();
    const salt = await genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = function (password) {
    return bcrypt.compare(password, this.password);
};


module.exports = mongoose.model("User", userSchema);