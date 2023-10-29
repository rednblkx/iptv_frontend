import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { Key } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLoaderData, useLocation, useParams } from "react-router-dom";
import { getChannelsQuery } from "../../apis/GetChannels";
import Skeleton from "../../components/Skeleton";
import { LoaderParams } from "../../apis/loader";

export default function ProviderChannels() {
  let { provider } = useParams();
  let location = useLocation();
  let { channels } = useLoaderData() as LoaderParams;
  const cardHover = useColorModeValue("blackAlpha.300", "whiteAlpha.300");
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
  } = useQuery({...getChannelsQuery(provider || null), initialData: channels});

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

  if ((isLoading && !isFetchedAfterMount) || !isFetched)
    return (<Skeleton/>);

  if (Object.keys(data.data).length === 0 || data?.data?.length == 0) {
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
          <Heading color="rgba(255,255,255, 0.7)">
            No channels available!
          </Heading>
        </Box>
      </>
    );
  }
  return (
    <Flex gap="20px" mx="20px" pb="6" wrap={"wrap"} justifyContent="space-around">
      {isSuccess &&
        !isFetching &&
        Object.keys(data?.data)?.map((item: any, i: Key | null | undefined) => (
          <Card
            key={i}
            as={Link}
            to={`/live/${provider}/${item}`}
            state={{ ...location.state, [item]: data.data[item].name }}
            minW={["150px", "160px"]}
            maxW={["140px"]}
            _hover={{ bg: cardHover }}
          >
            <CardBody
              display="flex"
              flexDirection="column"
              justifyContent="space-evenly"
            >
              <Image
                src={
                  data.data[item].img ||
                  "https://www.shutterstock.com/image-vector/picture-vector-icon-no-image-600w-1350441335.jpg"
                }
                width="100%"
                maxH="90px"
                objectFit="contain"
                alt={data.data[item].name}
                borderRadius="lg"
              />
              <Heading size="md" pt="2" alignSelf="center" maxWidth="100%">
                {data.data[item].name}
              </Heading>
            </CardBody>
          </Card>
        ))}
    </Flex>
  );
}
