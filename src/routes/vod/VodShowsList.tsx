import { SearchIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Card,
  CardBody, Flex,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Key } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  Link, useActionData, useLoaderData,
  useLocation, useParams, useSearchParams
} from "react-router-dom";
import { useDebounce } from "use-debounce";
import {
  getShowsQuery
} from "../../apis/GetVodShows";
import searchShow from "../../apis/SearchShow";
import Skeleton from "../../components/Skeleton";

export default function VodShowsList() {
  let { provider } = useParams() as { provider: string };
  let [searchParams, setSearchParams] = useSearchParams();
  let { options } = useLoaderData() as {shows: Record<string, unknown>, options: {data: {searchEnabled: boolean}}}
  
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
    refetch
  } = useInfiniteQuery({...getShowsQuery(provider, Object.fromEntries(searchParams))});
  const [value, setValue] = React.useState("");
  const actionData = useActionData() as {query: string};
  useEffect(() => {
    refetch();
  }, [searchParams])
  useEffect(() => {
    if (actionData?.query != undefined) {
      setValue(actionData?.query || "")
    }
  }, [actionData])
  
  const brightnessMode = useColorModeValue(
    "brightness(100%)",
    "brightness(80%)"
  );

  const {
    data: dataSearch,
    isLoading: isSearchLoading,
  } = useQuery({
    queryKey: [`searchShow/${value}`],
    queryFn: () => searchShow(provider || null, value),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(value),
    staleTime: 600000,
  });

  const location = useLocation();

  if (isError) {
    console.log(data);
    console.log(error);
    
    return (
      <>
        {/* <Box
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
        </Box> */}
      </>
    );
  }

  if (isLoading|| isSearchLoading)
    return (<Skeleton/>);

  if (data && data?.pages?.[0]?.data?.length == 0) {
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
        {isSuccess && !value
          ? data.pages?.map((page: { data: { data: { map: (arg0: (item: any, i: React.Key | null | undefined) => JSX.Element) => { page: string; }; }; }; }, i: any) =>
              page.data.data.map((item: any, i: Key | null | undefined) => (
                <Card
                  minW={["unset", "130px", "230px"]}
                  maxW={["unset", "190px", "230px"]}
                  borderRadius="md"
                  key={i}
                  as={Link}
                  to={item.link.includes("?") ? `/vod/${provider}${item.link.substr(item.link.indexOf("?"))}` : `/vod/${provider}/${item.id}`}
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
                      filter={brightnessMode}
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
                      backgroundColor="#00000075"
                      borderRadius="md"
                      borderTopRadius={["md", "0px"]}
                    >
                      <Heading size="md" textAlign="center" color="white">
                        {item.name}
                      </Heading>
                      <Text textAlign="center" color="white">
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
                      filter={brightnessMode}
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
                      backgroundColor="#00000075"
                      borderRadius="md"
                      borderTopRadius={["md", "0px"]}
                    >
                      <Heading size="md" textAlign="center" color="white">
                        {item.name}
                      </Heading>
                      <Text textAlign="center" color="white">
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
