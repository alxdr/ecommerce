const { ObjectId } = require("mongoose").Types;
const Message = require("../db/message");
const Review = require("../db/review");
const ensureAuthenticated = require("../helpers/ensureAuth");
const Transaction = require("../db/transaction");

const product = app => {
  app
    .route("/product/:id/thread")
    .get(async (req, res) => {
      const { id } = req.params;
      try {
        const thread = await Message.find({ target: new ObjectId(id) })
          .populate("author", "username")
          .populate({
            path: "replies",
            select: "text createdDate author",
            populate: { path: "author", select: "username" }
          })
          .exec();
        res.status(200).json({ thread });
      } catch (error) {
        res.status(500);
        res.type("txt");
        res.send(error.toString());
      }
    })
    .post(ensureAuthenticated, async (req, res) => {
      const { _id: uid } = req.user;
      const { id } = req.params;
      const { text } = req.body;
      try {
        await new Message({
          target: new ObjectId(id),
          text,
          author: uid
        }).save();
        res.sendStatus(200);
      } catch (error) {
        res.status(500);
        res.type("txt");
        res.send(error.toString());
      }
    });
  // Post reply to thread message
  app.post(
    "/product/:id/thread/:threadId",
    ensureAuthenticated,
    async (req, res) => {
      const { _id: uid } = req.user;
      const { threadId } = req.params;
      const { text } = req.body;
      try {
        const { _id: replyId } = await new Message({
          target: new ObjectId(threadId),
          text,
          author: uid
        }).save();
        await Message.findByIdAndUpdate(new ObjectId(threadId), {
          $push: { replies: replyId }
        });
        res.sendStatus(200);
      } catch (error) {
        res.status(500);
        res.type("txt");
        res.send(error.toString());
      }
    }
  );
  app.get("/product/:id/reviews", async (req, res) => {
    const { id } = req.params;
    try {
      const reviews = await Review.find({ target: new ObjectId(id) })
        .populate("author username")
        .exec();
      res.status(200).json({ reviews });
    } catch (error) {
      res.status(500);
      res.type("txt");
      res.send(error.toString());
    }
  });
  app.post(
    "/product/:id/reviews/:tid",
    ensureAuthenticated,
    async (req, res) => {
      const { _id: uid } = req.user;
      const { id, tid } = req.params;
      const { text } = req.body;
      try {
        const { _id: rid } = await new Review({
          target: new ObjectId(id),
          text,
          author: uid
        }).save();
        await Transaction.findByIdAndUpdate(new ObjectId(tid), {
          review: rid
        }).exec();
        res.sendStatus(200);
      } catch (error) {
        res.status(500);
        res.type("txt");
        res.send(error.toString());
      }
    }
  );
};

module.exports = product;
