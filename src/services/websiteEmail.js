import axios from "axios";
import API_BASE_URL from "../config/api";

const pendingRequests = new Map();

const normalizePayload = (payload) =>
  JSON.stringify(
    Object.keys(payload)
      .sort()
      .reduce((normalized, key) => {
        normalized[key] = payload[key];
        return normalized;
      }, {})
  );

const sendWebsiteEmail = async (payload) => {
  const requestKey = normalizePayload(payload);

  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }

  const body = new URLSearchParams();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      body.append(key, value);
    }
  });

  const request = axios
    .post(`${API_BASE_URL}/website-email`, body)
    .finally(() => {
      pendingRequests.delete(requestKey);
    });

  pendingRequests.set(requestKey, request);

  return request;
};

export default sendWebsiteEmail;