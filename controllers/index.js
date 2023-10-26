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
    // console.log(response);
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
