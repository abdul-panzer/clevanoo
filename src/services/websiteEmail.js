import axios from "axios";
import API_BASE_URL from "../config/api";

const FALLBACK_API_BASE_URL = API_BASE_URL.replace(
  "/backend/public/api",
  "/backend/public/index.php/api"
);

const sendWebsiteEmail = async (payload) => {
  try {
    return await axios.post(`${API_BASE_URL}/website-email`, payload);
  } catch (error) {
    if (error.response?.status === 404 && FALLBACK_API_BASE_URL !== API_BASE_URL) {
      return axios.post(`${FALLBACK_API_BASE_URL}/website-email`, payload);
    }

    throw error;
  }
};

export default sendWebsiteEmail;
