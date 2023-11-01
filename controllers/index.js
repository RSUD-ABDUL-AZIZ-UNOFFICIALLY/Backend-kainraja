require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require('axios');
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const payload = {
  gid: "Server Side",
};

async function api(path, method, data) {
  let token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
  try {
    let config = {
      method: method,
      url: process.env.HOST_API + path,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: data
    };
    let response = await axios(config);
    return response.data;
  } catch (err) {
    return null;
  }
}
async function apiLPKP(nik) {
  let natanik = jwt.sign(nik, process.env.JWT_SECRET_KEY_LPKP);
  try {
    let config = {
      method: 'GET',
      url: process.env.HOST_API_LPKP + '?nik=' + natanik,
      headers: {
        "Content-Type": "application/json",
      },
    };
    let response = await axios(config);
    // console.log(response);
    return response.data;
  } catch (err) {
    return null;
  }
}

module.exports = {
  hakpasien: async (req, res) => {
    let get = req.params.id;
    console.log(get);
    try {
      let data = fs.readFileSync(path.join(__dirname, "../public/information/" + get + ".json"));
      data = JSON.parse(data);

    return res.status(200).json({
      status: true,
      message: "success",
      data: data
    });
    } catch (err) {
      return res.status(404).json({
        status: false,
        message: "url tidak ditemukan",
        data: null
      });
    }
  },
  getPoli: async (req, res) => {
    try {
      let data = await api('/api/ralan/poli', 'GET');
      console.log(data);
      return res.status(200).json({
        status: true,
        message: "success",
        data: data.data
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "server Error",
        data: err.message
      });
    }
  },
  getPolidr: async (req, res) => {
    try {
      let data = await api('/api/ralan/drpoli', 'GET');
      return res.status(200).json({
        status: true,
        message: "success",
        data: data
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "server Error",
        data: err.message
      });
    }
  },
  getJadwalPoli: async (req, res) => {
    try {
      let query = req.query;
      let data = await api('/api/ralan/jadwal?kd_poli=' + query.kd_poli, 'GET');
      console.log(data);
      return res.status(200).json({
        status: true,
        message: "success",
        data: data.data
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "server Error",
        data: err.message
      });
    }
  },
  getJadwalPolidr: async (req, res) => {
    try {
      let query = req.query;
      let data = await api('/api/ralan/jadwal/bydr?kd_poli=' + query.kd_poli, 'GET');
      // console.log(data);
      for (let i = 0; i < data.data.length; i++) {
        let dataLPKP = await apiLPKP(data.data[i].no_ktp);
        // data.data[i].url = dataLPKP.data.url;
        if (dataLPKP == null) {
          data.data[i].url = 'https://api.rsudaa.singkawangkota.go.id/api/cdn/image/1698131414993-default-profile.webp';
        }else{
          data.data[i].url = dataLPKP.data.url;
        }
    
      }
      return res.status(200).json({
        status: true,
        message: "success",
        data: data.data
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "server Error",
        data: err.message
      });
    }
  },
  getJnslab: async (req, res) => {
    let search = req.query.search;
    console.log(search);
    if (search == undefined || search == "") {
      try {
        let data = await api('/api/penunjang/jnslab?limit=100&search=', 'GET');
        return res.status(200).json({
          status: true,
          message: "success",
          data: data.data
        });
      } catch (err) {
        return res.status(500).json({
          status: false,
          message: "server Error",
          data: err.message
        });
      }
    } else {
      try {
        let data = await api('/api/penunjang/cariLab?search=' + search, 'GET');
        return res.status(200).json({
          status: true,
          message: "success",
          data: data.data
        });
      } catch (err) {
        return res.status(500).json({
          status: false,
          message: "server Error",
          data: err.message
        });
      }
    }
  },
  getDetailLab: async (req, res) => {
    try {
      let id = req.params.id;
      let data = await api('/api/penunjang/jnslab/' + id, 'GET');
      console.log(data);
      return res.status(200).json({
        status: true,
        message: "success",
        data: data.data
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "server Error",
        data: err.message
      });
    }
  },
  getJnsradiaologi: async (req, res) => {
    try {
      let search = req.query.search;
      let data = await api('/api/penunjang/jnsrad/?limit=100&search=' + search, 'GET');
      return res.status(200).json({
        status: true,
        message: "success",
        data: data.data
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "server Error",
        data: err.message
      });
    }
  },
  getTindakan: async (req, res) => {
    try {
      let search = req.query.search;
      let data = await api('/api/penunjang/tariftind/?limit=10&search=' + search, 'GET');
      console.log(data);
      return res.status(200).json({
        status: true,
        message: "success",
        data: data.data
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "server Error",
        data: err.message
      });
    }
  },
  getAmbulan: async (req, res) => {
    try {
      let data = fs.readFileSync(path.join(__dirname, "../public/tarif/tarifAmbulan.json"));
      data = JSON.parse(data);
      const foundLocations = findByNameCharacter(data, req.query.search);
      function findByNameCharacter(data, character) {
        const foundData = [];

        for (const item of data) {
          for (const location of item.lokasi) {
            const namaLokasi = location.nama.toLowerCase(); // Konversi nama lokasi menjadi huruf kecil
            const characterLowerCase = character.toLowerCase(); // Konversi karakter yang dicari menjadi huruf kecil
            if (namaLokasi.includes(characterLowerCase)) {
              foundData.push(location);
            }
          }
        }
      
        return foundData;
    }
 
      return res.status(200).json({
        status: true,
        message: "success",
        data: foundLocations
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "server Error",
        data: err.message
      });
    }
  },
  getAntrianPoli: async (req, res) => {
    try {
      let query = req.query;
      // get day now
      let date = new Date();
      // ubah ke format yyyy-mm-dd
      date = date.toISOString().slice(0, 10);
      let data = await api('/api/ralan/antiran/poli?tgl_antrean=' + date + '&kd_poli=' + query.kd_poli, 'GET');
      let antrians = [];
      let sudah = 0;
      let belum = 0;
      let batal = 0;
      let total = data.data.length;
      for (let i of data.data) {
        if (i.stts == "Sudah") {
          sudah++;
        } else if (i.stts == "Belum") {
          belum++;
        } else if (i.stts == "Batal") {
          batal++;
        }
        let dataPasien = {}
        let namaPasien = i.pasien.nm_pasien;
        let tigaKarakterPertama = namaPasien.substring(0, 5);
        let sisanya = "x".repeat(namaPasien.length - 4);
        let pasien = tigaKarakterPertama + sisanya;
        dataPasien.no_reg = i.no_reg;
        dataPasien.no_rawat = i.no_rawat;
        dataPasien.nm_pasien = pasien;
        dataPasien.status = i.stts;
        dataPasien.nm_dokter = i.dokter.nm_dokter;
        dataPasien.kd_poli = i.kd_poli;
        antrians.push(dataPasien);
      }
      return res.status(200).json({
        status: true,
        message: "success",
        status_antrian: {
          sudah: sudah,
          belum: belum,
          batal: batal,
          total: total
        },
        data: antrians,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: false,
        message: "server Error",
        data: err.message
      });
    }
  },
  getMedia: async (req, res) => {
    let get = req.params.id;
    try {
      let data = fs.readFileSync(path.join(__dirname, "../public/media/" + get + ".json"));
      data = JSON.parse(data);

      return res.status(200).json({
        status: true,
        message: "success",
        data: data
      });
    } catch (err) {
      return res.status(404).json({
        status: false,
        message: "url tidak ditemukan",
        data: null
      });
    }
  },
  getMaps: async (req, res) => {
    try {
      let data = fs.readFileSync(path.join(__dirname, "../public/maps/index.json"));
      data = JSON.parse(data);
      return res.status(200).json({
        status: true,
        message: "success",
        data: data
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: "server Error",
        data: err.message
      });
    }
  }
};
