const express = require("express");
const indexRouter = require("../routes/index");
const accountRouter = require("../routes/account");
const nosqlRouter = require("../routes/nosql");
const ssrfRouter = require("../routes/ssrf");
const sstiRouter = require("../routes/ssti");
const xssRouter = require("../routes/xss");

module.exports = function (app) {
  app.use(express.json());

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
