// src/utils/pathHelper.js
const BASE_IMAGE_URL = "https://vmdjsc.com";

const getFullFtpUrl = (path) => {
  return path ? path.replace("/httpdocs", BASE_IMAGE_URL) : "";
};

export default getFullFtpUrl;