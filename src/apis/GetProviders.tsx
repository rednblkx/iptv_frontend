import axios from "axios";
import { QueryClient, UseQueryOptions } from "@tanstack/react-query";

export const getProvidersQuery = (): UseQueryOptions<
  any,
  unknown,
  any,
  string[]
> => ({
  queryKey: ["getProviders"],

  queryFn: getProviders,
  retry: 2,
  refetchOnMount: true,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  staleTime: 43200000,
});

export const providersLoader =
  (queryClient: QueryClient) =>
  async () => {
    const query = getProvidersQuery();
    return (await queryClient.ensureQueryData(query));
  };

export async function getProviders() {
  let res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/modules?cf_bypass=1`
  );
  return res.data;
}
