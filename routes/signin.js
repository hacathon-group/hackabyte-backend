const { PrismaClient } = require("@prisma/client");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const { user, trail, reservation, volunteer } = require("../mongoose/schema");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Load sample data (if needed)
async function loadSampleData() {
  const sampleData = require("./sampleData.json");
  // await user.deleteMany({});
  await trail.deleteMany({});
  await reservation.deleteMany({});
  console.log("Loading sample data");
  for (const trailz of sampleData.trails) {
    await trail.create(trailz);
  }
  for (const reservationz of sampleData.reservations) {
    await reservation.create(reservationz);
  }
  console.log("Loaded sample data");
}
loadSampleData();

module.exports = async function (fastify, opts) {
  // Define routes
  fastify.post("/newUser", async (req, reply) => {
      const { userID } = req.body;

      const {newlyRegistered} = await user.findOne({ userID });
      console.log(newlyRegistered)
      if (newlyRegistered) {
        await user.updateOne({ userID }, { newlyRegistered: false });
        return reply
          .status(200)
          .send({ newUser: true, message: "User already exists" });
      }

      return reply
        .status(200)
        .send({ newUser: false, message: "Send them to the question page" });
    }
  );

  fastify.post("/quizResults", async (req, reply) => {
      const { userID } = req.body;
      const { difficulty } = req.body;
      console.log(userID)
      console.log(difficulty)
      const userExists = await user.findOne({ userID });
      if (userExists) {
        await user.updateOne({ userID }, { difficulty });
        console.log("User info updated");
      } else {
        const newUser = await user.create({
          userID,
          reservations: [],
          difficulty,
        });
        console.log(`User created: ${newUser}`);
      }
      return reply.status(200).send({ newUser: true, message: "User created" });
    }
  );

  fastify.post("/newReservation", async (req, reply) => {
      const { userID } = req.body;
      const { reservationID } = req.body;
      console.log(userID)
      console.log(reservationID)
      const reservationExists = await reservation.findOne({ reservationID });
      console.log(reservationExists)
      if (reservationExists) {
        console.log("Reservation exists");
        await user.updateOne(
          { userID },
          { $push: { reservations: reservationID } }
        );
        await reservation.updateOne(
          { reservationID },
          { $inc: { attending: 1 } }
        );
        return reply.status(200).send({ success: true, message: "Reservation added" });
      }
    }
  );

  fastify.post("/getReservations", async (req, reply) => {
      const { userID } = req.body;

      const userDoc = await user.findOne({ userID });
      const reservations = await reservation.find({
        difficulty: userDoc.difficulty,
      });
      return reply.status(200).send({ reservations });
    }
  );

  fastify.post("/getMyReservations", async (req, reply) => {
      const { userID } = req.body;

      const userDoc = await user.findOne({ userID });
      const reservations = await reservation.find({
        reservationID: { $in: userDoc.reservations },
      });
      return reply.status(200).send({ reservations });
    }
  );

  fastify.post("/getTrailInfo", async (req, reply) => {
    const { trailID } = req.body;
    const trailInfo = await trail.findOne({ trailID });
    return reply.status(200).send({ trailInfo });
  });

  fastify.post("/cancelReservation", async (req, reply) => {
      const { userID } = req.body;
      const { reservationID } = req.body;

      await user.updateOne(
        { userID },
        { $pull: { reservations: reservationID } }
      );
      await reservation.updateOne(
        { reservationID },
        { $inc: { attending: -1 } }
      );
      return reply.status(200).send({ message: "Reservation cancelled" });
    }
  );
};
