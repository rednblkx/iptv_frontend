import { Flex, Skeleton, Card, CardBody } from "@chakra-ui/react";

export default function Skelet() {
  return (
    <Flex wrap="wrap" justifyContent="space-around" gap="20px" p="2">
      {Array.from({ length: 8 }, (_: any, i: number) => i + 1).map((_, i) => (
        <Skeleton maxW="190px" h="200px" m="0" key={i} borderRadius="4">
          <Card maxW="sm">
            <CardBody w="190px" h="200px"></CardBody>
          </Card>
        </Skeleton>
      ))}
    </Flex>
  );
}