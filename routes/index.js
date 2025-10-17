var express = require("express");
const { getPagePath } = require("./utils/pagePath");
var router = express.Router();
var path = require("path");
/* GET page. */

router.get("/api", function (req, res, next) {
  console.log("api");
  res.sendFile(path.join("..", "public", "api", "serverFetch.js"));
});

router.get("/", function (req, res, next) {
  console.log("/");
  res.sendFile(getPagePath("post-list"));
});

router.get("/login", function (req, res, next) {
  console.log("login", req);

  res.sendFile(getPagePath("login"));
});

router.get("/signin", function (req, res, next) {
  console.log("signin", req);
  res.sendFile(getPagePath("signin"));
});

router.get("/post-create", function (req, res, next) {
  console.log("post-create", req);
  res.sendFile(getPagePath("post-create"));
});

router.get("/post-list", function (req, res, next) {
  console.log("post-list", req);
  res.sendFile(getPagePath("post-list"));
});

router.get("/post", function (req, res, next) {
  console.log("post", req);
  res.sendFile(getPagePath("post"));
});

module.exports = router;
