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
  HStack,
  Image,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Key } from "react";
import { useInfiniteQuery } from "react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import getVodShows from "../../apis/GetVodShows";

export default function VodShowsList() {
  let { provider } = useParams();
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
    isLoading,
    isFetched,
    isFetchedAfterMount,
  } = useInfiniteQuery({
    queryKey: "getShowsList",
    queryFn: async ({ pageParam }) => getVodShows(provider || null, pageParam),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.data.pagination.current_page !=
        lastPage.data.pagination.total_pages
        ? lastPage.data.pagination.current_page + 1
        : null;
    },
    refetchOnWindowFocus: false,
  });

  const [isLoaded, setIsLoaded] = React.useState(false);

  const location = useLocation();

  if (isError && !isFetching) {
    return (
      <>
        <Box
          w="100%"
          h="calc(100% - var(--toolbar-size))"
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

  if ((isFetched && !isFetchedAfterMount) || isLoading)
    return (
      <Flex wrap="wrap" justify="center" gap="4">
        {Array.from({ length: 8 }, (_: any, i: number) => i + 1).map((_, i) => (
          <Skeleton maxW="218px" h="218px" m="0" key={i}>
            <Card maxW="sm">
              <CardBody w="218px" h="219px"></CardBody>
            </Card>
          </Skeleton>
        ))}
      </Flex>
    );

  if (data && data?.pages[0]?.data?.length == 0) {
    return (
      <Box
        w="100%"
        h="calc(100% - var(--toolbar-size))"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Heading color="rgba(255,255,255, 0.7)">No VODs available!</Heading>
      </Box>
    );
  }
  return (
    <>
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
        mx="20px"
        // pb="50px"
      >
        {isSuccess &&
          data.pages.map((page, i) =>
            page.data.data.map((item: any, i: Key | null | undefined) => (
              <Card
                maxW="sm"
                key={i}
                as={Link}
                to={`/vod/${provider}/${item.id}`}
                state={{ ...location.state, [item.id]: item.name }}
              >
                <CardBody>
                  <Image
                    src={
                      item.img ||
                      "https://www.shutterstock.com/image-vector/picture-vector-icon-no-image-600w-1350441335.jpg"
                    }
                    width="100%"
                    height={item.img ? "auto" : "90px"}
                    objectFit="cover"
                    alt={item.name}
                    borderRadius="lg"
                  />
                  <Stack mt="6" spacing="3">
                    <Heading size="md">{item.name}</Heading>
                    <Text>
                      {item.date &&
                        new Date(item.date as Date).toLocaleString()}
                    </Text>
                  </Stack>
                </CardBody>
              </Card>
            ))
          )}
      </SimpleGrid>
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
