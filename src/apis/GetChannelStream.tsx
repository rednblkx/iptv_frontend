import axios from "axios";
import { QueryClient, UseQueryOptions } from "@tanstack/react-query";
import { LoaderParams } from "./loader";

export const getChannelStreamQuery = (
  provider: string | null,
  channel: string | null,
): UseQueryOptions<any, unknown, any, string[]> => ({
  queryKey: [`getStream/${provider}/${channel}`],
  queryFn: async () =>
    getChannelStream(provider || null, channel || null),
  retry: 2,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  staleTime: 7200000,
});

export const channelStreamLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderParams) => {
    const query = getChannelStreamQuery(params.provider || null, params.channel || null);

    return (await queryClient.ensureQueryData(query));
  };

export default async function getChannelStream(provider: string | null, channel: string | null) {
  let res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/${provider}/live/${channel}?cf_bypass=1`);
  return res.data
}