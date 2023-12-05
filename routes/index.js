const express = require("express");
const routes = express.Router();

const base = require('../controllers');

routes.get('/umum/:id', base.hakpasien);

routes.get('/poli/all', base.getPoli);
routes.get('/poli/bydr', base.getPolidr);
routes.get('/poli/jadwal', base.getJadwalPoli);
routes.get('/poli/drjadwal', base.getJadwalPolidr);

routes.get('/penunjang/jnslab', base.getJnslab);
routes.get('/penunjang/jnslab/:id', base.getDetailLab);
routes.get('/penunjang/getjnsradiaologi', base.getJnsradiaologi);

routes.get('/tarif/tindakan', base.getTindakan);
routes.get('/tarif/ambulan', base.getAmbulan);

routes.get('/antrian/poli', base.getAntrianPoli);
routes.get('/kamar/inap', base.getKamarInap);

routes.get('/media/:id', base.getMedia);
routes.get('/maps', base.getMaps);

module.exports = routes;