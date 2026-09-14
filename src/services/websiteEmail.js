import axios from "axios";
import API_BASE_URL from "../config/api";

const sendWebsiteEmail = async (payload) => {
  const body = new URLSearchParams();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      body.append(key, value);
    }
  });

  return axios.post(`${API_BASE_URL}/website-email`, body);
};

export default sendWebsiteEmail;
