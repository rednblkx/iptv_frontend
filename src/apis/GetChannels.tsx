import axios from "axios";
import { QueryClient, UseQueryOptions } from "@tanstack/react-query";
import { LoaderParams } from "./loader";

export const getChannelsQuery = (provider: string | null): UseQueryOptions<
  any,
  unknown,
  any,
  string[]
> => ({
  queryKey: [`getChannels/${provider}`],

  queryFn: () => getChannels(provider),
  refetchOnWindowFocus: false,
  staleTime: 14400000
});

export const channelsLoader =
  (queryClient: QueryClient) =>
  async ({params}:LoaderParams) => {
    const query = getChannelsQuery(params.provider || null);

    return (await queryClient.ensureQueryData(query));
  };

export default async function getChannels(provider: string | null) {
  let res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/${provider}/live?cf_bypass=1`);
  return res.data;
}