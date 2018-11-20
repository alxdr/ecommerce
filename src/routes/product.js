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
          .populate("replies", "text author")
          .exec();
        res.status(200).json({ thread });
      } catch (error) {
        res.status(500).send(error);
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
        res.status(500).send(error);
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
        res.status(500).send(error);
      }
    }
  );
  app.get("/product/:id/reviews", async (req, res) => {
    const { id } = req.params;
    try {
      const reviews = await Review.find({ target: new ObjectId(id) }).exec();
      res.status(200).json({ reviews });
    } catch (error) {
      res.status(500).send(error);
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
        await Transaction.findByIdAndUpdate(tid, { review: rid }).exec();
        res.sendStatus(200);
      } catch (error) {
        res.status(500).send(error);
      }
    }
  );
};

module.exports = product;
