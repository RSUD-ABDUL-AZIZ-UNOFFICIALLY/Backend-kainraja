const express = require("express");
const routes = express.Router();

const base = require('../controllers');

routes.get('/umum/:id', base.hakpasien);
routes.get('/poli/all', base.getPoli);
routes.get('/poli/jadwal', base.getJadwalPoli);

routes.get('/penunjang/jnslab', base.getJnslab);
routes.get('/penunjang/jnslab/:id', base.getDetailLab);
routes.get('/penunjang/getjnsradiaologi', base.getJnsradiaologi);

module.exports = routes;