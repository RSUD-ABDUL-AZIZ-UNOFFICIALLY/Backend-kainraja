const express = require("express");
const routes = express.Router();

const base = require('../controllers');

routes.get('/umum/:id', base.hakpasien);
routes.get('/poli/all', base.getPoli);
routes.get('/poli/jadwal', base.getJadwalPoli);


module.exports = routes;