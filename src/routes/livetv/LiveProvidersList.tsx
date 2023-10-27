import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Image,
} from "@chakra-ui/react";
import { Key } from "react";
import { useQuery } from "react-query";
import { Link, useLocation } from "react-router-dom";
import getProviders from "../../apis/GetProviders";
import Skeleton from "../../components/Skeleton";

export default function ProvidersList() {
  const location = useLocation()
  const { data, status, isFetched, isFetchedAfterMount, isLoading } = useQuery(
    "getLiveProviders",
    getProviders,
    {
      retry: 2,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 43200000
    }
  );

  if (status === "error") {
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
          <Heading>Error</Heading>
        </Box>
      </>
    );
  }

  if ((isLoading && !isFetchedAfterMount) || !isFetched)
    return (<Skeleton/> );

  return (
    <>
      <Flex
        gap="20px"
        pb="50px"
        wrap="wrap"
        justifyContent="space-evenly"
      >
        {status == "success" &&
          data.data.live.map((item: any, i: Key | null | undefined) => (
            <Card
              key={i}
              as={Link}
              to={`/live/${item.id}`}
              state={{...location.state,
                [item.id]: item.id
                  .split("-")
                  .map((a: string) => a[0].toUpperCase() + a.substring(1))
                  .join(" "),
              }}
              // minWidth="100px"
              maxW={["150px", "190px", "220px"]}
              maxH="100px"
            >
              <CardBody
                display="flex"
                flexDirection="column"
                justifyContent="space-evenly"
                height="100%"
              >
                <Image
                  src={
                    item.logo ||
                    "https://www.shutterstock.com/image-vector/picture-vector-icon-no-image-600w-1350441335.jpg"
                  }
                  width="auto"
                  h="100%"
                  objectFit="contain"
                  alt={item.id}
                  borderRadius="lg"
                />
                <Heading size="md" pt="2" alignSelf="center">
                  {item.id
                    .split("-")
                    .map((a: string) => a[0].toUpperCase() + a.substring(1))
                    .join(" ")}
                </Heading>
              </CardBody>
            </Card>
          ))}
      </Flex>
    </>
  );
}
