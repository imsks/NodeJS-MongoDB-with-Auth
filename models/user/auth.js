const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
    },
    contactNo: {
        type: String,
        unique: [true, "Your contact alredy exists. Try logging in."],
    },
    hashedPassword: {
        type: String,
    },
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;
