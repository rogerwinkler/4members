import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: 'http://localhost:8081/api/v0.01/'
  })
}

// return axios(url, {
//       method: 'GET',
//       mode: 'no-cors',
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Content-Type': 'application/json',
//       },
//       withCredentials: true,
//       credentials: 'same-origin',
//     }).then(response => {
// })
