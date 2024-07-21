"use strict";

const path = require("path");
const fs = require("node:fs");
const AutoLoad = require("@fastify/autoload");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async function (fastify, opts) {
	console.log(`started on port 3000`);
	// registering fastify plugins
	fastify.register(AutoLoad, {
		dir: path.join(__dirname, "plugins"),
		options: Object.assign({}, opts),
	});

	// registerting routes
	fastify.register(AutoLoad, {
		dir: path.join(__dirname, "routes"),
		options: Object.assign({}, opts),
	});


};

module.exports.options = {
	trustProxy: true,
};