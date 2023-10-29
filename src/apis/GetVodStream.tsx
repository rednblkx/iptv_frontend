import axios from "axios";
import { QueryClient, UseQueryOptions } from "@tanstack/react-query";
import { LoaderParams } from "./loader";

export const getVodStreamQuery = (
  provider: string | undefined,
  show: string | undefined,
  epid: string | undefined
): UseQueryOptions<any, unknown, any, string[]> => ({
  queryKey: [`getEpisodeStream/${provider}/${show}/${epid}`],
  queryFn: async () =>
    getVodStream(provider || null, show || null, epid || null),
  retry: 2,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  staleTime: 7200000,
});

export const vodStreamLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderParams) => {
    const query = getVodStreamQuery(params.provider, params.show, params.epid);

    return (await queryClient.ensureQueryData(query));
  };

export default async function getVodStream(
  provider: string | null,
  show: string | null,
  epid: string | null
) {
  let res = await axios.get(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/${provider}/vod/${show}/${epid}?cf_bypass=1`
  );
  return res.data;
}
