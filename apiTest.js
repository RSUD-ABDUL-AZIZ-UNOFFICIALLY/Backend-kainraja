const axios = require('axios');


function rest(method, url) {
    let config = {
        method: method,
        maxBodyLength: Infinity,
        url: 'http://localhost:3000' + url,
        headers: {}
    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}
rest(process.argv[2], process.argv[3])