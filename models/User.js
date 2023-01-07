const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator'); //pour un mail = 1 compte

const userSchema = mongoose.Schema({
    email : {type: String, required: true, unique: true}, //unique pour un compte = un mail (pas plus)
    password: {type: String, required: true},
});

userSchema.plugin(uniqueValidator); //un cpt = 1 mail

module.exports = mongoose.model('User', userSchema);