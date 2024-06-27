const express = require("express");
const router = express.Router();
const { signup, signin, getUsers } = require("./users.controllers");
const passport = require("passport");

router.post("/signup", signup);
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);
router.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  getUsers
);

module.exports = router;
