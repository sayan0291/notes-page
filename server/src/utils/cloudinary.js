import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import CLOUD_NAME from "../constant.js"

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export const clodinaryData = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        //upload the file on clodinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        //check the response after successfull upload of the file

        console.log("clodinary upload successfull",response)
        fs.unlinkSync(localFilePath) //also remove after successfull submition so the disk storage always clean
        return response;

    } catch (error) { 

        //remove the file resource after the unsuceessfull clodinary submition

        fs.unlinkSync(localFilePath);
        console.log("clodinary upload error",error);
        return null;
    }
}