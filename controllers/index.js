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
    console.log(response);
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

};
