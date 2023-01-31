import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

router.route('/').get(async(req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json({success: true, data: posts})
    } catch (error) {
        res.status(500).json({success: false, message: error})
    }
});

// Create a post
router.route('/').post(async(req, res) => {
    try {
        const { name, prompt, photo} = req.body;
        const photoUrl = await cloudinary.uploader.upload(photo);
        const newPost = await Post.create({
            name,
            prompt,
            photo: photoUrl.url,
        })
        res.status(201).json({success: true, data: newPost});
    } catch(error) {
        res.status(500).json({success: false, message: 'Unable to create a post, please try again'})
    }
});

// Delete a post 
router.route('/').delete(async(req, res) => {
    try {
        const { _id, photo} = req.body;
        console.log(photo); // returns http://res.cloudinary.com/drpy5jqfi/image/upload/v1675092312/ebszbw35dao0lmjckpou.png, do regex to get only the last part after png 
        
        await cloudinary.uploader.destroy(photo);
        //cloudinary.uploader.destroy('pgwubp0e150ybridw462')
        const deletePost = await Post.deleteOne({
            _id
        })
        res.status(201).json({success: true, data: deletePost});
    } catch(error) {
        res.status(500).json({success: false, message: 'Unable to delete post, please try again'})
    }
});


export default router;