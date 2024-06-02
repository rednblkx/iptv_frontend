import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  StyleFunctionProps,
  type ThemeConfig,
} from "@chakra-ui/react";
import {
  createBrowserRouter, RouterProvider
} from "react-router-dom";
import "./index.css";
import NoMatch from "./routes/NoMatch";
import Index from "./routes/Index";
import ProviderChannels from "./routes/livetv/ProviderChannels";
import ProvidersList from "./routes/livetv/LiveProvidersList";
import VodRoute from "./routes/vod/VodProvidersList";
import ChannelStream from "./routes/livetv/ChannelStream";
import VodShowsList from "./routes/vod/VodShowsList";
import VodEpisodesList from "./routes/vod/VodEpisodesList";
import VodStream from "./routes/vod/VodStream";
import { ModInfoLoader } from "./apis/GetModuleInfo";
import { Layout } from "./components/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getProvidersQuery, providersLoader } from "./apis/GetProviders";
import { getShowsQuery } from "./apis/GetVodShows";
import { LoaderParams } from "./apis/loader";
import { episodesLoader } from "./apis/GetEpisodesList";
import { vodStreamLoader } from "./apis/GetVodStream";
import { ErrorElement } from "./components/ErrorElement";
import { channelsLoader, getChannelsQuery } from "./apis/GetChannels";
import { channelStreamLoader, getChannelStreamQuery } from "./apis/GetChannelStream";
import { Background } from "./components/Background";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000,
    },
  },
});

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const theme = extendTheme(
  { config },
  {
    components: {
      Card: {
        // The styles all Cards have in common
        baseStyle: (props: StyleFunctionProps) => ({
          container: {
            bg:
              props.colorMode === "dark" ? "whiteAlpha.100" : "blackAlpha.100",
            shadow: "sm",
          },
        }),
      },
      Button: {
        baseStyle: {
          shadow: "sm",
        },
      },
    },
  }
);

let router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "live",
        element: <Layout />,
        handle: {
          crumb: () => [{ id: "live", name: "Live" }],
        },
        children: [
          {
            index: true,
            id: "liveRoot",
            loader: providersLoader(queryClient),
            element: <ProvidersList />,
            handle: {
              query: (data: LoaderParams) => getProvidersQuery(),
            },
          },
          {
            path: ":provider",
            element: <Layout />,
            loader: async ({ params }) => params,
            handle: {
              crumb: (data: LoaderParams) => [
                {
                  id: data.provider,
                  name: data.provider
                    ?.split("-")
                    .map((a: string) => a[0].toUpperCase() + a.substring(1))
                    .join(" "),
                },
              ],
            },
            children: [
              {
                index: true,
                id: "channelsList",
                loader: (loader) => {
                  let data = channelsLoader(queryClient)(loader);
                  return { params: loader.params, channels: data };
                },
                element: <ProviderChannels />,
                handle: {
                  query: (data: LoaderParams) => getChannelsQuery(data.params.provider || null),
                },
              },
              {
                path: ":channel",
                loader: async (loader) => {
                  const data = await channelStreamLoader(queryClient)(loader);
                  return { params: loader.params, channelData: data };
                },
                element: <ChannelStream />,
                handle: {
                  crumb: (data: LoaderParams) => [
                    {
                      id: data.params.channel,
                      name: data?.channelData?.data.channel_name,
                    },
                  ],
                  query: (data: LoaderParams) => getChannelStreamQuery(data.params.provider || null, data.params.channel || null),
                },
              },
            ],
          },
        ],
      },
      {
        path: "vod",
        element: <Layout />,
        handle: {
          crumb: () => [{ id: "vod", name: "VOD" }],
        },
        children: [
          {
            index: true,
            id: "vodRoot",
            loader: providersLoader(queryClient),
            element: <VodRoute />,
          },
          {
            path: ":provider",
            element: <Layout />,
            id: "vodProvider",
            loader: async ({ params }) => params,
            action: async ({ params, request }) => {
              let formData = await request.json();
              return formData;
            },
            handle: {
              crumb: (data: LoaderParams) => [
                {
                  id: data.provider,
                  name: data.provider
                    ?.split("-")
                    .map((a: string) => a[0].toUpperCase() + a.substring(1))
                    .join(" "),
                },
              ],
            },
            children: [
              {
                index: true,
                element: <VodShowsList />,
                id: "vodShows",
                loader: async (data1) => {
                  let options = await ModInfoLoader(queryClient)(data1);
                  return { params: data1.params, options };
                },
                handle: {
                  query: (data: LoaderParams) => getShowsQuery(data.params.provider || null, {}),
                },

              },
              {
                path: ":show",
                element: <Layout />,
                id: "vodEpisodes",
                loader: async (data) => {
                  let show = await episodesLoader(queryClient)(data);
                  return { params: data.params, show };
                },
                handle: {
                  crumb: (data: LoaderParams) => [
                    {
                      id: data.params.show,
                      name: data.show.pages[0].data.show_name,
                    },
                  ]
                },
                children: [
                  {
                    index: true,
                    element: <VodEpisodesList />,
                    loader: ({ params }) => params,
                    handle: {
                      query: (data: LoaderParams) => getShowsQuery(data.params.provider || null, {}),
                    }
                  },
                  {
                    path: ":epid",
                    id: "vodStream",
                    element: <Layout />,
                    children: [
                      {
                        index: true,
                        element: <VodStream />,
                        loader: async (data) => {
                          let ep = await vodStreamLoader(queryClient)(data);
                          return { params: data.params, ep };
                        },
                        handle: {
                          crumb: (data: LoaderParams) => [
                            {
                              id: data.params.epid,
                              name: data.ep.data.ep_name,
                            },
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <NoMatch />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} fallbackElement={<Background />} />
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
