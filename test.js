const axios = require('axios')
let data = [{
  "title": "One Piece",
  "link": "https://anibatch.anibatch.moe/one-piece/",
  "thumb": "https://anibatch.anibatch.moe/wp-content/uploads/2021/01/One-Piece.jpg"
},
  {
    "title": "One Piece Movie 14: Stampede",
    "link": "https://anibatch.anibatch.moe/one-piece-movie-14-stampede/",
    "thumb": "https://anibatch.anibatch.moe/wp-content/uploads/2020/01/One-Piece-Movie-14-Stampede.jpg"
  }]

let result = data.reduce((accumulatorPromise, data) => {
  return accumulatorPromise.then(() => {
    return new Promise((resolve, reject) =>
      {
        axios.get(data.thumb).then((res) => {
          console.log(res.response)
          resolve(res);
        })
        .catch(function (error) {
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


      });
  });
}, Promise.resolve());

//return tes