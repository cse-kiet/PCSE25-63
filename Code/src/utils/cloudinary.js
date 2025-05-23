require('dotenv').config(); // Load environment variables from .env file

const cloudinary = require('cloudinary');
const fs = require('fs');

// Configure Cloudinary with your credentials
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });
        // console.log("in cloudinary " + response);
        // Delete the locally stored file after successful upload
        fs.unlinkSync(localFilePath);

        // Return the Cloudinary URL of the uploaded file
        return response.secure_url;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        // Handle error appropriately, maybe retry or notify the user
        return null;
    }
};

module.exports = uploadOnCloudinary;
