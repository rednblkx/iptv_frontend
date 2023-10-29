import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Card,
  CardBody,
  Code,
  Heading,
  Link,
  Skeleton,
} from "@chakra-ui/react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLoaderData, useParams } from "react-router-dom";
import videojs from "video.js";
import { getVodStreamQuery, vodStreamLoader } from "../../apis/GetVodStream";
import VideoJS from "../../components/Player";

export default function VodStream() {
  const playerRef = React.useRef(null);

  let { provider, show, epid } = useParams();
  let { ep } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof vodStreamLoader>>
  >;
  const {
    data,
    status,
    isError,
    isFetching,
    error,
    isSuccess,
    isFetched,
    isFetchedAfterMount,
    isLoading,
  } = useQuery({...getVodStreamQuery(provider, show, epid), initialData: ep});

  // const isSuccess = true

  const videoJsOptions = {
    src: data?.data?.stream.includes(".m3u8")
      ? data?.data?.stream
      : `${import.meta.env.VITE_API_BASE_URL}/cors/${data?.data?.stream}`,
    keySystems: {
      "com.widevine.alpha": `${import.meta.env.VITE_API_BASE_URL}/cors/${
        data?.data?.drm?.url
      }`,
    },
  };

  const handlePlayerReady = (player: any) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player?.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player?.on("dispose", () => {
      videojs.log("player will dispose");
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

  if ((isLoading && !isFetchedAfterMount))
    return (
      <Box p="6" bg="white" w="100%">
        <Skeleton height="260px" borderRadius="4" />
      </Box>
    );

  if (data && data?.data?.length == 0) {
    return (
      <Box
        w="100%"
        h="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Heading color="rgba(255,255,255, 0.7)">No Episodes available!</Heading>
      </Box>
    );
  }
  return (
    <Box pb="5">
      {isSuccess && (
        <Card mb="2" mx="2">
          <CardBody p="1">
            <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
          </CardBody>
        </Card>
      )}
      {isSuccess && data?.data?.stream && (
        <Card mx="2">
          <CardBody>
            <Link isExternal href={data?.data.stream}>
              {data?.data.stream}
            </Link>
          </CardBody>
        </Card>
      )}
      {isSuccess && data?.data?.drm && (
        <Card mx="2">
          <CardBody>
            <Code>{data?.data.drm.url}</Code>
          </CardBody>
        </Card>
      )}
    </Box>
  );
}
