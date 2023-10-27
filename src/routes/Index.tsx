import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Card, CardBody, Flex, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <Flex
      flex="1"
      justifyContent="space-evenly"
      alignContent="center"
      wrap="wrap"
      flexDir={["column", "row"]}
      py="10"
    >
          <Card as={Link} to="/live" state={{live: "Live TV"}}>
            <CardBody display="flex" alignItems="center" justifyContent="space-between">
              <Text fontSize="4xl" align="center">Live TV</Text>
              <ArrowForwardIcon fontSize="4xl"/>
            </CardBody>
          </Card>
          <Card as={Link} to="/vod" state={{vod: "VOD"}}>
            <CardBody display="flex" alignItems="center" justifyContent="space-evenly">
              <Text fontSize="4xl">VOD</Text>
              <ArrowForwardIcon fontSize="4xl"/>
            </CardBody>
          </Card>
    </Flex>
  );
}
