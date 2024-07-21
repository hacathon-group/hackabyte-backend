"use strict";

const path = require("path");
const AutoLoad = require("@fastify/autoload");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async function (fastify, opts) {
  // Log server start
  fastify.log.info("Server started on port 3000");

  // Registering Fastify plugins
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  });

  // Registering routes
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, opts),
  });
};

module.exports.options = {
  trustProxy: true,
};
