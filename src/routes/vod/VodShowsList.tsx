import { SearchIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Key } from "react";
import { useInfiniteQuery, useQuery } from "react-query";
import { Link, useLoaderData, useLocation, useParams } from "react-router-dom";
import { useDebounce } from "use-debounce";
import getVodShows from "../../apis/GetVodShows";
import searchShow from "../../apis/SearchShow";
import Skeleton from "../../components/Skeleton";

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
    queryKey: `getShowsList/${provider}`,
    queryFn: async ({ pageParam }) => getVodShows(provider || null, pageParam),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.data.pagination.current_page !=
        lastPage.data.pagination.total_pages
        ? lastPage.data.pagination.current_page + 1
        : null;
    },
    refetchOnWindowFocus: false,
    staleTime: 600000,
  });
  const [value, setValue] = React.useState("");
  const [searchEnabled, setSearch] = useState(false);
  const options = useLoaderData() as {
    data: { searchEnabled: boolean };
  };

  useEffect(() => {
    setSearch(options.data.searchEnabled);
  }, []);

  const textColorMode = useColorModeValue("black", "white");

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setValue(event.target.value);
  const [finalValue] = useDebounce(value, 1000);

  const {
    data: dataSearch,
    isLoading: isSearchLoading,
    isFetched: isSearchFetched,
  } = useQuery(
    `searchShow/${finalValue}`,
    () => searchShow(provider || null, value),
    {
      enabled: Boolean(finalValue),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const location = useLocation();

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

  if (data && data?.pages[0]?.data?.length == 0) {
    return (
      <Box
        w="100%"
        h="100%"
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
      {searchEnabled && (
        <Flex marginBottom="1.5rem" justifyContent="center" px="5">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon />
            </InputLeftElement>
            <Input
              value={value}
              onChange={handleChange}
              type="search"
              placeholder="Search a show"
              _placeholder={{ color: "inherit" }}
            />
          </InputGroup>
        </Flex>
      )}
      <Flex
        gap="20px"
        wrap={["nowrap", "wrap"]}
        flexDirection={["column", "row"]}
        justifyContent="space-around"
        // minW={["120px", "200px", "230px"]}
        mx="20px"
        // alignItems="start"
        // pb="50px"
      >
        {isSuccess && !finalValue
          ? data.pages.map((page, i) =>
              page.data.data.map((item: any, i: Key | null | undefined) => (
                <Card
                  minW={["unset", "130px", "230px"]}
                  maxW={["unset", "190px", "230px"]}
                  borderRadius="md"
                  key={i}
                  as={Link}
                  to={`/vod/${provider}/${item.id}`}
                  state={{ ...location.state, [item.id]: item.name }}
                >
                  <CardBody
                    display="flex"
                    flexDir={["row", "column"]}
                    p="0"
                    position={["relative", "inherit"]}
                  >
                    <Image
                      src={
                        item.img ||
                        "https://www.shutterstock.com/image-vector/picture-vector-icon-no-image-600w-1350441335.jpg"
                      }
                      // width="100%"
                      // height={item.img ? "auto" : "90px"}
                      objectFit="cover"
                      alt={item.name}
                      borderRadius="md"
                      borderBottomRadius={["md", "0px"]}
                      // flex={["1", "auto"]}
                      position={["relative", "inherit"]}
                      maxH="100px"
                      w="100%"
                    />
                    <Flex
                      // mt="6"
                      flexDir="column"
                      flex={["2", "auto"]}
                      alignItems="center"
                      justifyContent="space-evenly"
                      p="3"
                      pos={["absolute", "inherit"]}
                      w="100%"
                      h="100%"
                      backgroundColor="#b0b0b050"
                      borderRadius="md"
                      borderTopRadius={["md", "0px"]}
                    >
                      <Heading
                        size="md"
                        textAlign="center"
                        color={["black", textColorMode]}
                      >
                        {item.name}
                      </Heading>
                      <Text textAlign="center" color={["black", textColorMode]}>
                        {item.date &&
                          new Date(item.date as Date).toLocaleString()}
                      </Text>
                    </Flex>
                  </CardBody>
                </Card>
              ))
            )
          : dataSearch?.data.data.map(
              (
                item: { id: any; name: string; img: any; date: Date },
                i: React.Key | null | undefined
              ) => (
                <Card
                  minW={["unset", "130px", "230px"]}
                  maxW={["unset", "190px", "230px"]}
                  borderRadius="md"
                  key={i}
                  as={Link}
                  to={`/vod/${provider}/${item.id}`}
                  state={{ ...location.state, [item.id]: item.name }}
                >
                  <CardBody
                    display="flex"
                    flexDir={["row", "column"]}
                    p="0"
                    position={["relative", "inherit"]}
                  >
                    <Image
                      src={
                        item.img ||
                        "https://www.shutterstock.com/image-vector/picture-vector-icon-no-image-600w-1350441335.jpg"
                      }
                      // width="100%"
                      // height={item.img ? "auto" : "90px"}
                      objectFit="cover"
                      alt={item.name}
                      borderRadius="md"
                      borderBottomRadius={["md", "0px"]}
                      // flex={["1", "auto"]}
                      position={["relative", "inherit"]}
                      maxH="100px"
                      w="100%"
                    />
                    <Flex
                      // mt="6"
                      flexDir="column"
                      flex={["2", "auto"]}
                      alignItems="center"
                      justifyContent="space-evenly"
                      p="3"
                      pos={["absolute", "inherit"]}
                      w="100%"
                      h="100%"
                      backgroundColor="#b0b0b040"
                      borderRadius="md"
                      borderTopRadius={["md", "0px"]}
                    >
                      <Heading
                        size="md"
                        textAlign="center"
                        color={["black", textColorMode]}
                      >
                        {item.name}
                      </Heading>
                      <Text textAlign="center" color={["black", textColorMode]}>
                        {item.date &&
                          new Date(item.date as Date).toLocaleString()}
                      </Text>
                    </Flex>
                  </CardBody>
                </Card>
              )
            )}
      </Flex>
      <Flex pb="5rem" pt="2rem" justifyContent="center">
        <Button
          onClick={() => fetchNextPage()}
          isDisabled={
            !hasNextPage || isFetchingNextPage || dataSearch?.data.data
          }
          isLoading={isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage && !dataSearch?.data.data
            ? "Load More"
            : "Nothing more to load"}
        </Button>
      </Flex>
    </>
  );
}
