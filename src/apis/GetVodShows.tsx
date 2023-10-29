import axios from "axios";
import {
  QueryClient,
  UseInfiniteQueryOptions
} from "@tanstack/react-query";
import { LoaderParams } from "./loader";

export const getShowsQuery = (
  provider: string | null
): UseInfiniteQueryOptions<any, unknown, any, any, string[], string> => ({
  queryKey: [`getShowsList/${provider}`],
  initialPageParam: "1",
  queryFn: async ({ pageParam }) => getVodShows(provider || null, pageParam),
  getNextPageParam: (lastPage) => {
    return lastPage.data.pagination.current_page !=
      lastPage.data.pagination.total_pages
      ? lastPage.data.pagination.current_page + 1
      : null;
  },
  refetchOnWindowFocus: false,
  staleTime: 600000,
});

export const showsLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderParams) => {
    const query = getShowsQuery(params.provider || null);

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchInfiniteQuery(query))
    );
  };

export async function getVodShows(
  provider: string | null,
  page: string | null
) {
  let res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/${provider}/vod?page=${
      page || 1
    }&cf_bypass=1`
  );
  return res.data;
}
