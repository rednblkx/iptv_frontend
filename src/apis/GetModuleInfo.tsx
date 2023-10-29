import axios from "axios";
import { QueryClient, UseQueryOptions } from "@tanstack/react-query";
import { LoaderParams } from "./loader";

export const getModInfoQuery = (provider: string | undefined): UseQueryOptions<
  any,
  unknown,
  any,
  string[]
> => ({
  queryKey: ["getModInfo"],

  queryFn: () => getModuleInfo(provider || null),
  retry: 2,
  refetchOnMount: true,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  staleTime: 43200000,
});

export const ModInfoLoader =
  (queryClient: QueryClient) =>
  async ({params} : LoaderParams) => {
    const query = getModInfoQuery(params.provider);

    return (await queryClient.ensureQueryData(query));
  };

export default async function getModuleInfo(provider: string | null) {
  let res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/${provider}?cf_bypass=1`);
  return res.data;
}