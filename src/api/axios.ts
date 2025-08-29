import axios from "axios";

// export default axios.create({
//     baseURL: import.meta.env.VITE_BACKEND_URL,
//     headers: {
//         'X-Requested-With': 'XMLHttpRequest',
//     },
//     withCredentials: true,
//     withXSRFToken: true,
// })

export default axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // example: http://localhost:8000
  withCredentials: true, 
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN", 
});