const express = require("express");

const router = express.Router();

const { shorten, redirect, deleteUrl } = require("./urls.controllers");

router.post("/shorten/:userId", shorten);
router.get("/:code", redirect);
router.delete("/:code", deleteUrl);

module.exports = router;
