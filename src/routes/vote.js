const express = require("express");
const { ObjectId } = require("mongoose").Types;
const Vote = require("../db/vote");
const Message = require("../db/message");
const Review = require("../db/review");
const Product = require("../db/product");
const ensureAuthenticated = require("../helpers/ensureAuth");

const vote = app => {
  const upVoteRouter = express.Router();
  const downVoteRouter = express.Router();

  upVoteRouter.post("/thread/:id", async (req, res) => {
    const { id } = req.params;
    const { _id: uid } = req.user;
    const threadId = new ObjectId(id);
    try {
      const voted = await Vote.findOne({
        target: threadId,
        type: "Message",
        by: uid
      }).exec();
      if (voted === null) {
        await new Vote({
          target: threadId,
          type: "Message",
          vote: true,
          by: uid
        }).save();
        await Message.findByIdAndUpdate(threadId, {
          $inc: { votes: 1 }
        }).exec();
      }
      res.sendStatus(200);
    } catch (error) {
      res.status(500);
      res.type("txt");
      res.send(error.toString());
    }
  });
  upVoteRouter.post("/review/:id", async (req, res) => {
    const { id } = req.params;
    const { _id: uid } = req.user;
    const reviewId = new ObjectId(id);
    try {
      const voted = await Vote.findOne({
        target: reviewId,
        type: "Review",
        by: uid
      }).exec();
      if (voted === null) {
        await new Vote({
          target: reviewId,
          type: "Review",
          vote: true,
          by: uid
        }).save();
        await Review.findByIdAndUpdate(reviewId, {
          $inc: { votes: 1 }
        }).exec();
      }
      res.sendStatus(200);
    } catch (error) {
      res.status(500);
      res.type("txt");
      res.send(error.toString());
    }
  });
  upVoteRouter.post("/product/:id", async (req, res) => {
    const { id } = req.params;
    const { _id: uid } = req.user;
    const pid = new ObjectId(id);
    try {
      const voted = await Vote.findOne({
        target: pid,
        type: "Product",
        by: uid
      }).exec();
      if (voted === null) {
        await new Vote({
          target: pid,
          type: "Product",
          vote: true,
          by: uid
        }).save();
        await Product.findByIdAndUpdate(pid, {
          $inc: { votes: 1 }
        }).exec();
      }
      res.sendStatus(200);
    } catch (error) {
      res.status(500);
      res.type("txt");
      res.send(error.toString());
    }
  });

  downVoteRouter.post("/thread/:id", async (req, res) => {
    const { id } = req.params;
    const { _id: uid } = req.user;
    const threadId = new ObjectId(id);
    try {
      const voted = await Vote.findOne({
        target: threadId,
        type: "Message",
        by: uid
      }).exec();
      if (voted === null) {
        await new Vote({
          target: threadId,
          type: "Message",
          vote: false,
          by: uid
        }).save();
        await Message.findByIdAndUpdate(threadId, {
          $inc: { votes: -1 }
        }).exec();
      }
      res.sendStatus(200);
    } catch (error) {
      res.status(500);
      res.type("txt");
      res.send(error.toString());
    }
  });
  downVoteRouter.post("/review/:id", async (req, res) => {
    const { id } = req.params;
    const { _id: uid } = req.user;
    const reviewId = new ObjectId(id);
    try {
      const voted = await Vote.findOne({
        target: reviewId,
        type: "Review",
        by: uid
      }).exec();
      if (voted === null) {
        await new Vote({
          target: reviewId,
          type: "Review",
          vote: false,
          by: uid
        }).save();
        await Review.findByIdAndUpdate(reviewId, {
          $inc: { votes: -1 }
        }).exec();
      }
      res.sendStatus(200);
    } catch (error) {
      res.status(500);
      res.type("txt");
      res.send(error.toString());
    }
  });
  downVoteRouter.post("/product/:id", async (req, res) => {
    const { id } = req.params;
    const { _id: uid } = req.user;
    const pid = new ObjectId(id);
    try {
      const voted = await Vote.findOne({
        target: pid,
        type: "Product",
        by: uid
      }).exec();
      if (voted === null) {
        await new Vote({
          target: pid,
          type: "Product",
          vote: false,
          by: uid
        }).save();
        await Product.findByIdAndUpdate(pid, {
          $inc: { votes: -1 }
        }).exec();
      }
      res.sendStatus(200);
    } catch (error) {
      res.status(500);
      res.type("txt");
      res.send(error.toString());
    }
  });

  app.use("/vote/up", ensureAuthenticated, upVoteRouter);
  app.use("/vote/down", ensureAuthenticated, downVoteRouter);
};

module.exports = vote;
