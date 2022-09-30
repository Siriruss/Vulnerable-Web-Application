//Required Modules and initialize variables
const express = require("express");
const indexRouter = require("../routes/index");
const accountRouter = require("../routes/account");
const nosqlRouter = require("../routes/nosql");
const ssrfRouter = require("../routes/ssrf");
const sstiRouter = require("../routes/ssti");
const xssRouter = require("../routes/xss");

//exports all routes to be used throughout application
module.exports = function (app) {
  //allows parsing of requests
  app.use(express.json());

  //used to verify if a user is logged in or not.
  app.use((req, res, next) => {
    if (req.user) {
      res.locals.user = req.user;
    }

    next()
  })

  app.use("/", indexRouter);
  app.use("/account", accountRouter);
  app.use("/login", accountRouter);
  app.use("/register", accountRouter);
  app.use("/nosql", nosqlRouter);
  app.use("/ssrf", ssrfRouter);
  app.use("/ssti", sstiRouter);
  app.use("/xss", xssRouter);
};
