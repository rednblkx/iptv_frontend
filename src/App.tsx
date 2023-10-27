import { Link, Outlet, useLocation } from "react-router-dom";
import Toolbar from "./components/Toolbar";
import { Box, Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ArrowBackIcon } from "@chakra-ui/icons";

const queryClient = new QueryClient();

function App() {
  const location = useLocation();
  const bgColorMode = useColorModeValue("#cec9ad", "#332f2f")
  return (
    <QueryClientProvider client={queryClient}>
      <Box pos="fixed" w="100%" h="100%" backgroundColor={bgColorMode} filter="blur(100px)" zIndex="-1"/>
      <Flex flexDir="column" h="100dvh">
        <Toolbar />
        {location.pathname != "/" && (
          <Flex align="center" ml="5" mb="4" mt="4">
            <Button w="30px" as={Link} to=".." relative="path">
              <ArrowBackIcon color="white.500" />
            </Button>
            <Text ml="2" fontSize="lg">
              {location.pathname != "/" &&
                (location.state?.[
                  location.pathname.split("/").filter((i) => i)[
                    location.pathname.split("/").filter((i) => i).length - 1
                  ]
                ] ||
                  location.pathname
                    .split("/")
                    .filter((i) => i)
                    [
                      location.pathname.split("/").filter((i) => i).length - 1
                    ]?.split("-")
                    .map((a: string) => a[0].toUpperCase() + a.substring(1))
                    .join(" "))}
            </Text>
          </Flex>
        )}
        <Outlet />
      </Flex>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
