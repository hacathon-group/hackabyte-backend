"use strict";

const fp = require("fastify-plugin");
const dotenv = require("dotenv");
dotenv.config();
const { clerkClient, clerkPlugin, getAuth } = require("@clerk/fastify");

/**
 * This plugin adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
module.exports = fp(async function (fastify, opts) {
    fastify.register(clerkPlugin);
});