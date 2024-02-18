const express = require("express");
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
const productsRouter = express.Router();

// Get all products
productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
    
    });
    res.send(products);
  } catch (error) {
    next(error);
  }
});

// Get a product by id
productsRouter.get("/:id", async (req, res, next) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: parseInt(req.params.id),       
      },
    });

    if (!product) {
      return res.status(404).send("product not found.");
    }

    res.send(product);
  } catch (error) {
    next(error);
  }
});

// Deny access if product is not logged in
productsRouter.use((req, res, next) => {
  if (!req.user) {
    return res.status(401).send("You must be logged in to do that.");
  }
  next();
});

// Create a new product
productsRouter.post("/", async (req, res, next) => {
  const {name, description, size, price, seller, quantity, imageUrl} = req.body;
  try {
        const token = req.headers.authorization.split(" ")[1]; // Extract the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        const userId = decoded.id;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        size,
        price,
        seller,
        quantity,
        imageUrl,

      },
    });
    res.status(201).send(product);
  } catch (error) {
    console.error('error fetching products, error')
    next(error);
  }
});

// Update a product
productsRouter.put("/:id", async (req, res, next) => {
  const {name, description, size, price, quantity, imageUrl} = req.body;
  try {
    const product = await prisma.product.update({
      data: {
        name,
        description,
        size,
        price,
        quantity,
        imageUrl,
      },
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!product) {
      return res.status(404).send("product not found.");
    }

    res.send("Product updated successfully.");
  } catch (error) {
    next(error);
  }
});

// Delete a product by id
productsRouter.delete("/:id", async (req, res, next) => {
  try {
    const product = await prisma.product.delete({
      where: {
        id: parseInt(req.params.id),
      },
    });

    if (!product) {
      return res.status(404).send("product not found.");
    }

    res.send("Product deleted successfully.");
  } catch (error) {
    next(error);
  }
});

module.exports = productsRouter;