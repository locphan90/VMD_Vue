// src/utils/pathHelper.js
const BASE_IMAGE_URL = "https://dnfsoft.click";

const getFullFtpUrl = (path) => {
  return path ? path.replace("/httpdocs", BASE_IMAGE_URL) : "";
};

export default getFullFtpUrl;