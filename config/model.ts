import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, default: '' },
    userId: { type: Number, required: true, unique: true },
    publicKey: { type: String, default: '' },
    result: { type: Boolean, default: false }
});

const UserModel = mongoose.model("user", UserSchema);

export default UserModel;