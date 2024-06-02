import axios from "axios";
import {
  QueryClient,
  UseInfiniteQueryOptions
} from "@tanstack/react-query";
import { LoaderParams } from "./loader";

export const getEpisodesQuery = (
  provider: string | undefined,
  show: string | undefined,
  searchParam: { [k: string]: string; }
): UseInfiniteQueryOptions<any, unknown, any, any, string[], string> => ({
  queryKey: [`getEpisodesList/${provider}/${show}`],
  initialPageParam: "",
  queryFn: async ({ pageParam }) =>
    getEpisodesList(provider || null, show || null, pageParam, searchParam),

  getNextPageParam: (lastPage, pages) => {
    return lastPage.data.pagination?.current_page !=
      lastPage.data.pagination?.total_pages
      ? lastPage.data.pagination?.current_page + 1
      : null;
  },
  refetchOnWindowFocus: false,
  staleTime: 600000,
});

export const episodesLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderParams) => {
    const query = getEpisodesQuery(params.provider, params.show, {});

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchInfiniteQuery(query))
    );
  };

export async function getEpisodesList(
  provider: string | null,
  show: string | null,
  page: string | null,
  param: { [k: string]: string; }
) {
  console.log(page);
  console.log(param);
  
  let serialize = (obj : { [k: string]: string; }) => {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.length > 0 ? "&" + str.join("&") : str.join("&");
  }
  let res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/${provider}/vod/${show}${page ? "?page=" +
    page + `&cf_bypass=1${serialize(param)}` : `?cf_bypass=1${serialize(param)}`}`
  );
  return res.data;
}
