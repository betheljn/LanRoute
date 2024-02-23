const express = require('express');
const commentRouter = require('./comment');
const postRouter = require('./posts');
const likesRouter = require('./likes');
const tagRouter = require('./tags');
const voteRouter = require('./vote');
const router = express.Router();

commentRouter.use("/comment", require("./comment"));
postRouter.use("/posts", require("./posts"));
likesRouter.use("/likes", require("./likes"));
tagRouter.use("/tags", require("./tags"));
voteRouter.use("/vote", require("./vote"));

module.exports = router;