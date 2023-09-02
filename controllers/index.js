require("dotenv").config();
const fs = require("fs");
const path = require("path");


module.exports = {
  hakpasien: async (req, res) => {
    let data = fs.readFileSync(path.join(__dirname, "../public/information/hakpasein.json"));
    data = JSON.parse(data);

    return res.status(200).json({
      status: true,
      message: "Hak Pasien",
      data: data
    });
  },
};
