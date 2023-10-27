import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Key } from "react";
import { useInfiniteQuery } from "react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import getEpisodesList from "../../apis/GetEpisodesList";
import Skeleton from "../../components/Skeleton";

export default function VodEpisodesList() {
  let location = useLocation();
  let { provider, show } = useParams();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    isError,
    isSuccess,
    isFetchedAfterMount,
    isFetched,
    isLoading,
  } = useInfiniteQuery({
    queryKey: `getEpisodesList/${provider}/${show}`,
    queryFn: async ({ pageParam }) =>
      getEpisodesList(provider || null, show || null, pageParam),

    getNextPageParam: (lastPage, pages) => {
      return lastPage.data.pagination.current_page !=
        lastPage.data.pagination.total_pages
        ? lastPage.data.pagination.current_page + 1
        : null;
    },
    refetchOnWindowFocus: false,
    staleTime: 600000,
  });

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

  if ((isLoading && !isFetchedAfterMount) || !isFetched) return <Skeleton />;

  if (data && data?.pages[0].data?.length == 0) {
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
            No Episodes available!
          </Heading>
        </Box>
      </>
    );
  }
  return (
    <>
      <Flex
        gap="20px"
        wrap="wrap"
        mx="20px"
        justifyContent="space-around"
        // pb="50px"
      >
        {isSuccess &&
          data.pages.map((page, i) =>
            page?.data.data.map((item: any, i: Key | null | undefined) => (
              <Card
                key={i}
                minW={["100px", "130px", "170px"]}
                maxW={["150px", "190px", "220px"]}
                as={Link}
                to={`/vod/${provider}/${show}/${item.id}`}
                state={{
                  ...location.state,
                  [show || "show"]: location.state?.[show || ""],
                  [item.id || "epname"]: item.name,
                }}
              >
                <CardBody p="0">
                  <Image
                    src={
                      item.img ||
                      "https://www.shutterstock.com/image-vector/picture-vector-icon-no-image-600w-1350441335.jpg"
                    }
                    width="100%"
                    height={item.img ? "auto" : "90px"}
                    objectFit="cover"
                    borderRadius="lg"
                  />
                  {/* <Stack spacing="3" p="2">
                    <Heading size="md">{item.name}</Heading>
                    <Text>{new Date(item.date as Date).toLocaleString()}</Text>
                  </Stack> */}
                  <Flex
                    // mt="6"
                    flexDir="column"
                    flex="1"
                    alignItems="center"
                    justifyContent="space-evenly"
                    p="3"
                  >
                    <Heading size="1" textAlign="center" pb="2">
                      {item.name}
                    </Heading>
                    <Text textAlign="center">
                      {item.date &&
                        new Date(item.date as Date).toLocaleString()}
                    </Text>
                  </Flex>
                </CardBody>
              </Card>
            ))
          )}
      </Flex>
      <Flex pb="5rem" pt="2rem" justifyContent="center">
        <Button
          onClick={() => fetchNextPage()}
          isDisabled={!hasNextPage || isFetchingNextPage}
          isLoading={isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </Button>
      </Flex>
    </>
  );
}
