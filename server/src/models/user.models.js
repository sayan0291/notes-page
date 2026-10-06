import mongoose,{ Schema } from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
},{timestamps: true}
)

userSchema.pre("save",async function () {
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,10)
})

export const User = mongoose.model("User", userSchema)