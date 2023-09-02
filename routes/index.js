const express = require("express");
const routes = express.Router();

const base = require('../controllers');

routes.get('/umum/hakpasien', base.hakpasien);


module.exports = routes;