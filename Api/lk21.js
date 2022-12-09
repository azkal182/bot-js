const axios = require("axios")
const url = "https://encouraging-bat-sun-hat.cyclic.app/api/movie/lk21/"
class Lk21 {
  async search(query) {

    let result = await axios.get(url+'search?q=' + query).then((res) => {
      const data = res.data
      return data
      console.log(data)
    }).catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    });
    //console.log(result)
    return result
  }

  async show(id) {

    let result = await axios.get(url+'show?id=' + id).then((res) => {
      const data = res.data
      //console.log(data)
      return data
    }).catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {

        console.log(error.request);
      } else {

        console.log('Error', error.message);
      }
      console.log(error.config);
    });
    //console.log(result)
    return result
  }
}

module.exports = Lk21