import mongoose,{ Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.getAccessToken = async function () {
    jwt.sign(
        {
            _id: this._id,
            userName: this.userName
        },
        process.env.ACCESSTOKEN_SECRET_KEY,
        {
            expiresIn: process.env.ACCESSTOKEN_SECRET_EXPIRY
        }
    )
}

userSchema.methods.getRefreshToken = async function (){
    jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESHTOKEN_SECRET_KEY,
        {
            expiresIn: process.env.REFRESHTOKEN_SECRET_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)