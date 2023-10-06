const express = require("express");
const auth = require("../../middleware/auth");
const asyncMiddleware = require("../../middleware/async");
const { Brand, validate } = require("./models/product");

const router = express.Router();

const mongoose = require("mongoose");

const multer = require("multer");

const bodyParser = require('body-parser');

router.use(bodyParser.json());

const upload = multer();




module.exports = router;
