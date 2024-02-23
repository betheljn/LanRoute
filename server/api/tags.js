const tagRouter  = require('express').Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Get all Tags for a post
tagRouter.post('/', async (req, res, next) => {
    try {
        const tag = await prisma.tag.findMany();
        res.json(tag);
    } catch (error) {
        next(error);
    }
});

// Create a new tag
tagRouter.post("/", require('../auth/middleware'),async (req, res, next) => {
    const { text, postId } = req.body;
    
    try {
        // Retrieve the tag data based on the user ID obtained from the token
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
  
        if (!user) {
            // Handle the case where the user is not found
            return res.status(404).send("User not found.");
        }
  
        // Create a new tag with the author set to the retrieved user
        const tag = await prisma.tag.create({
            data: {
                text,
                postId: parseInt(postId),
                userId: parseInt(userId)
            },
        });
  
        res.status(201).send(tag);
    } catch (error) {
        console.error('Error creating Tag:', error);
        next(error);
    }
  });

// Delete a tag 
tagRouter.delete("/:id", require('../auth/middleware'), async (req, res, next) => {
    const tagId = parseInt(req.params.id);
  
    try {
        // Check if the tag exists and if the logged-in user is the author of the tag
        const tag = await prisma.tag.findFirst({
            where: {
                id: tagId,
                userId: userId
            }
        });
  
        if (!tag) {
            return res.status(404).send("Tag not found or you are not authorized to delete it.");
        }
  
        // Delete the tag
        await prisma.tag.delete({ where: { id: tagId } });
  
        res.send("Tag deleted successfully.");
    } catch (error) {
        console.error('Error deleting tag:', error);
        next(error);
    }
  });


module.exports = tagRouter;