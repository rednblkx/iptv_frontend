import axios from "axios";

export default async function getModuleInfo(provider: string | null) {
  let res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/${provider}?cf_bypass=1`);
  return res.data;
}