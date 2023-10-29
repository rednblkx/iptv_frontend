import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Card,
  CardBody,
  Link as LinkText,
  Code,
  Skeleton,
} from "@chakra-ui/react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { LoaderFunctionArgs, useLoaderData, useLocation, useParams } from "react-router-dom";
import videojs from "video.js";
import {
  getChannelStreamQuery,
} from "../../apis/GetChannelStream";
import VideoJS from "../../components/Player.jsx";

export default function ChannelStream() {
  const location = useLocation();

  let { provider, channel } = useParams();
  const { channelData } = useLoaderData() as {params: LoaderFunctionArgs['params'], channelData: {[x: string]: any}};
  const {
    data,
    status,
    error,
    isFetching,
    isSuccess,
    isError,
    isFetched,
    isFetchedAfterMount,
    isLoading,
  } = useQuery({
    ...getChannelStreamQuery(provider || null, channel || null),
    initialData: channelData,
  });  

  const playerRef = React.useRef(null);
  const videoJsOptions = {
    src: data?.data?.stream.includes(".m3u8")
      ? `${
          import.meta.env.VITE_API_BASE_URL
        }/${provider}/live/${channel}/index.m3u8?cf_bypass=1`
      : `${import.meta.env.VITE_API_BASE_URL}/cors/${data?.data?.stream}`,
    keySystems: {
      "com.widevine.alpha": `${import.meta.env.VITE_API_BASE_URL}/cors/${
        data?.data?.drm?.url
      }`,
    },
  };

  const handlePlayerReady = (player: any) => {
    playerRef!.current = player;

    // You can handle player events here, for example:
    player?.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player?.on("dispose", () => {
      videojs.log("player will dispose");
    });
    player.tech().on("retryplaylist", () => {
      player.src({
        src: `${
          import.meta.env.VITE_API_BASE_URL
        }/${provider}/live/${channel}/index.m3u8?cf_bypass=1&cors=1`,
      });
    });
  };

  if (isError && !isFetching) {
    return (
      <>
        <Box
          w="100%"
          h="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Alert status="error" w="50%">
            <AlertIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{(error as any)?.message}</AlertDescription>
          </Alert>
        </Box>
      </>
    );
  }

  if (isLoading && !isFetchedAfterMount)
    return (
      <Box p="6" bg="white" w="100%">
        <Skeleton height="260px" borderRadius="4" />
      </Box>
    );

  return (
    <Box mb="2">
      {isSuccess && (
        <Card mb="2" mx="2">
          <CardBody p="1">
            <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
          </CardBody>
        </Card>
      )}
      {isSuccess && data?.data?.stream && (
        <Card mb="2" mx="2">
          <CardBody>
            <LinkText href={data?.data.stream} isExternal>
              {data?.data.stream}
            </LinkText>
          </CardBody>
        </Card>
      )}
      {isSuccess && data?.data?.drm && data?.data?.drm.url && (
        <Card mx="2" mb="2">
          <CardBody>
            <Code>{data?.data.drm.url}</Code>
          </CardBody>
        </Card>
      )}
    </Box>
  );
}
