const postRouter  = require('express').Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Get all posts
postRouter.get("/", async (req, res, next) => {
    try {
      const post = await prisma.post.findMany();
      res.send(post);
    } catch (error) {
      next(error);
    }
  });

// Get posts by id
postRouter.get("/:id", async (req, res, next) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await prisma.post.findUnique({
        where: {
          id: postId
        },
    });
  
    if (!post) {
        return res.status(404).send("Post not found.");
    }
  
    res.send(post);
    } catch (error) {
    next(error);
    }
});

// Create a new post
postRouter.post("/", require('../auth/middleware'), async (req, res, next) => {
    const { title, content, published } = req.body;
    
    try {
        // Retrieve the user data based on the user ID obtained from the token
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
  
        if (!user) {
            // Handle the case where the user is not found
            return res.status(404).send("User not found.");
        }
  
        // Create a new post with the author set to the retrieved user
        const post = await prisma.post.create({
            data: {
                title,
                content,
                published, 
                author: { connect: { id: userId } }
            },
        });
  
        res.status(201).send(post);
    } catch (error) {
        console.error('Error creating post:', error);
        next(error);
    }
  });

// Delete a post 
postRouter.delete("/:id", require('../auth/middleware'), async (req, res, next) => {
    const postId = parseInt(req.params.id);
  
    try {
        // Check if the post exists and if the logged-in user is the author of the post
        const post = await prisma.post.findFirst({
            where: {
                id: postId,
                author: {
                    id: userId
                }
            }
        });
  
        if (!post) {
            return res.status(404).send("Post not found or you are not authorized to delete it.");
        }
  
        // Delete the post
        await prisma.post.delete({ where: { id: postId } });
  
        res.send("Post deleted successfully.");
    } catch (error) {
        console.error('Error deleting post:', error);
        next(error);
    }
  });


module.exports = postRouter;