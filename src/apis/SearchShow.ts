import axios from "axios";

export default async function searchShow(provider: string | null, string: string) {
  let res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/${provider}/vod?search=${string}&cf_bypass=1`);
  return res.data;
}