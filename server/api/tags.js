const router  = require('express').Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Get all Tags for a post
router.post('/', async (req, res, next) => {
    try {
        const tag = await prisma.tag.findMany();
        res.json(tag);
    } catch (error) {
        next(error);
    }
});

// Authentication Middleware
router.use((req, res, next) => {
    // Skip authentication check for the login route
    if (req.path === '/login') {
        return next();
    }

    // Check if the authorization header is present
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send("You must be logged in to do that.");
    }

    // Extract the token from the authorization header
    const token = authHeader.split(' ')[1];

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, "secretOrPrivateKey");
        // Attach the decoded token to the request object
        req.user = decoded;
        // Proceed with the request
        next();
    } catch (error) {
        // If the token is invalid or expired, return an error response
        return res.status(401).send("Invalid or expired token.");
    }
});


// Create a new tag
router.post("/", async (req, res, next) => {
    const { text, postId } = req.body;
    
    try {
        const token = req.headers.authorization.split(" ")[1]; // Extract the token
        const decoded = jwt.verify(token, "secretOrPrivateKey"); // Verify the token
        const userId = decoded.id;
  
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
        const comment = await prisma.comment.create({
            data: {
                text,
                postId: parseInt(postId),
                userId: parseInt(userId)
            },
        });
  
        res.status(201).send(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        next(error);
    }
  });

// Delete a comment 
router.delete("/:id", async (req, res, next) => {
    const commentId = parseInt(req.params.id);
  
    try {
        const token = req.headers.authorization.split(" ")[1]; // Extract the token
        const decoded = jwt.verify(token, "secretOrPrivateKey"); // Verify the token
        const userId = decoded.id;
  
        // Check if the comment exists and if the logged-in user is the author of the comment
        const comment = await prisma.comment.findFirst({
            where: {
                id: commentId,
                userId: userId
            }
        });
  
        if (!comment) {
            return res.status(404).send("Comment not found or you are not authorized to delete it.");
        }
  
        // Delete the comment
        await prisma.comment.delete({ where: { id: commentId } });
  
        res.send("Comment deleted successfully.");
    } catch (error) {
        console.error('Error deleting comment:', error);
        next(error);
    }
  });


module.exports = router;