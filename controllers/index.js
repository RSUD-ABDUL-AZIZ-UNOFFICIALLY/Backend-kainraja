require("dotenv").config();
const fs = require("fs");
const path = require("path");


module.exports = {
  hakpasien: async (req, res) => {
    let get = req.params.id;
    console.log(get);
    try {
      let data = fs.readFileSync(path.join(__dirname, "../public/information/" + get + ".json"));
      data = JSON.parse(data);

    return res.status(200).json({
      status: true,
      message: "Hak Pasien",
      data: data
    });
    } catch (err) {
      return res.status(404).json({
        status: false,
        message: "Url tidak ditemukan",
        data: null
      });
    }
  },
};
