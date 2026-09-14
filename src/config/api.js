const LOCAL_API_BASE_URL = "http://192.168.0.244/clevanoo_website/backend/public/api";
const PRODUCTION_API_BASE_URL = "https://clevanoo.com/backend/public/api";

const isLocalHost = ["localhost", "127.0.0.1", "192.168.0.244"].includes(
  window.location.hostname
);

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (isLocalHost ? LOCAL_API_BASE_URL : PRODUCTION_API_BASE_URL);

export default API_BASE_URL;
