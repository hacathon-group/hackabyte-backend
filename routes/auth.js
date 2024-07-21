const { PrismaClient } = require("@prisma/client");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require('@fastify/jwt');

const { user } = require("../mongoose/schema");

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = async function (fastify, opts) {
  // Signup Route
  fastify.post("/signup", async (request, reply) => {
    const { username, password, email } = request.body;
    console.log("new signup requestd");
    try {
      const existingUser = await user.findOne({ username });
      if (existingUser) {
        return reply.status(400).send({ message: "Username already exists" });
      }

      const newUser = new user({ username, password, email });
      await newUser.save();
      // log data of new user
      console.log(`New user created: ${newUser}`);
      reply.status(201).send(existingUser.userID);
    } catch (error) {
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  fastify.post("/login", async (request, reply) => {
    const { username, password } = request.body;
    console.log(username, password);
    try {
        const existingUser = await user.findOne({ username });
        if (!existingUser) {
            return reply.status(400).send({ message: 'Invalid username or password' });
        }

        const validPassword = await existingUser.verifyPassword(password);
        if (!validPassword) {
            return reply.status(400).send({ message: 'Invalid username or password' });
        }

        reply.status(201).send(existingUser.userID) 
        
    } catch (error) {
        console.log(error);
        reply.status(500).send({ error: 'Internal Server Error' });
    }
  });
};
