import ky from "npm:ky";

export const CDN_BASE_URL = "https://storage.googleapis.com/blockprints-prod/";
export const API_BASE_URL = "https://api.blockprints.io/api/v1/";
export const BASE_URL = "https://blockprints.io/";

export const client = ky.extend({
  prefixUrl: API_BASE_URL,
  headers: {
    "User-Agent": "Source-Librarian",
  },
});
