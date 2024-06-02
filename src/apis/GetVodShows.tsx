import axios from "axios";
import {
  QueryClient,
  UseInfiniteQueryOptions
} from "@tanstack/react-query";
import { LoaderParams } from "./loader";

export const getShowsQuery = (
  provider: string | null,
  searchParam: { [k: string]: string; }
): UseInfiniteQueryOptions<any, unknown, any, any, string[], string> => ({
  queryKey: [`getShowsList/${provider}`],
  initialPageParam: "",
  queryFn: async ({ pageParam }) => getVodShows(provider || null, pageParam, searchParam),
  getNextPageParam: (lastPage) => {
    return lastPage.data.pagination?.current_page !=
      lastPage.data.pagination?.total_pages
      ? lastPage.data.pagination?.current_page + 1
      : null;
  },
  refetchOnWindowFocus: false,
  staleTime: 600000,
});

export const showsLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderParams) => {
    const query = getShowsQuery(params.provider || null, {});

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchInfiniteQuery(query))
    );
  };

export async function getVodShows(
  provider: string | null,
  page: string | null,
  param: { [k: string]: string; }
) {
  let serialize = (obj : { [k: string]: string; }) => {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.length > 0 ? "&" + str.join("&") : str.join("&");
  }
  let res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/${provider}/vod?${page ? "page=" +
      page + `&cf_bypass=1${serialize(param)}` : `cf_bypass=1${serialize(param)}`}`
  );
  return res.data;
}
