"use strict";

const fp = require("fastify-plugin");

/**
 * This plugin only allows https://bypass.city to send CORS requests
 *
 * @see https://github.com/fastify/fastify-sensible
 */
module.exports = fp(async function (fastify, opts) {
	fastify.register(require("@fastify/cors"), {
		origin: ["*", "localhost", "localhost:3000"],
	});
});