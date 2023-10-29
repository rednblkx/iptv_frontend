import { Box, useColorModeValue } from "@chakra-ui/react";

export function Background() {
  const bgColorMode = useColorModeValue("#cec9ad", "#332f2f");
  return (
    <Box
      pos="fixed"
      w="100%"
      h="100%"
      backgroundColor={bgColorMode}
      filter="blur(100px)"
      zIndex="-1"
    />
  )
}