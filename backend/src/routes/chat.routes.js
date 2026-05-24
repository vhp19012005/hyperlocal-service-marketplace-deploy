const express = require("express");
const { chatWithGroq } = require("../controllers/chat.controller");

const router = express.Router();

router.post("/", chatWithGroq);

module.exports = router;
