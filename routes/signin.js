const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
import { clerkClient, getAuth } from "@clerk/fastify";

mongoose
  .connect(
    "mongodb+srv://varram:abtoGjLt7LP4jInl@cluster0.f2axjm4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected!"));

const { user, trail, reservation, volunteer } = require("./schema");

function sendMessage(message) {
  request(webhookUrl, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      content: message,
    }),
  });
}

// async function verifyCaptchaRespose(token, ip) {
// 	let formData = new FormData();
// 	formData.append('secret', secrectCaptchaKey);
// 	formData.append('response', token);
// 	formData.append('remoteip', ip);
// 	const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
// 	const result = await fetch(url, {
// 		body: formData,
// 		method: 'POST',
// 	});

// 	const outcome = await result.json();
// 	return outcome;
// }
module.exports = async function (fastify, opts) {
  fastify.get("/newUser", async (req, res) => {
    const { userId } = getAuth(req);
    const user = userId ? await clerkClient.users.getUser(userId) : null;
    if (user) {
      // throw user not found error
      return res.status(404).send({ error: "User not registered" });
    }

    const userExists = await user.findOne({ clerkID: user.id });
    if (userExists)
      return res.status(200).send({ newUser: false, message: "User already exists" });

	return res.status(200).send({ newUser: true, message: "send them to the questionPage" });
  });
  fastify.post("/quizResults", async (req, res) => {
	const { userId } = getAuth(req);
	const user = userId ? await clerkClient.users.getUser(userId) : null;
	if (user) {
	  // throw user not found error
	  return res.status(404).send({ error: "User not registered" });
	}

	const userExists = await user.findOne({ clerkID: user.id });
	if (userExists) {
		console.log("update user info");
		await user.updateOne({ clerkID: user.id }, { difficulty: req.body.difficulty });
	}

	const { difficulty } = req.body;
	const newUser = await user.create({
	  clerkID: user.id,
	  reservations: [],
	  difficulty,
	});

	return res.status(200).send({ newUser: true, message: "User created" });
  });
};
