import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex, Progress,
  Spacer,
  Text
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Link,
  Outlet,
  Params,
  useLocation,
  useMatches,
  useNavigation
} from "react-router-dom";
import { LoaderParams } from "./apis/loader";
import { Background } from "./components/Background";
import Toolbar from "./components/Toolbar";

function App() {
  let matches = useMatches() as {
    id: string;
    pathname: string;
    params: Params<string>;
    data: LoaderParams;
    handle: {
      query(query: any): unknown;
      crumb: (data: LoaderParams) => {
        id: string;
        name: any;
      }[];
    };
  }[];
  let crumbs = matches
    // first get rid of any matches that don't have handle and crumb
    .filter((match) => Boolean(match.handle?.crumb))
    // now map them into an array of elements, passing the loader
    // data to each one
    .map((match) => match.handle.crumb(match.data));

  // let query = matches
  //   // first get rid of any matches that don't have handle and crumb
  //   .filter((match) => Boolean(match.handle?.query))
  //   .map((query) => query.handle.query(query.data)) as UseQueryOptions[];
  const location = useLocation();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  // const { data, refetch } = useQuery(
  //   { ...query[0] || getProvidersQuery(), enabled: Boolean(query.length > 0) },
  //   queryClient
  // );
  return (
    <>
      <Background/>
      <Flex flexDir="column" h="100dvh">
        <Toolbar />
        {navigation.state == "loading" && (
          <Progress size="xs" isIndeterminate />
        )}
        {location.pathname != "/" && (
          <Flex align="center" mx="5" mb="4" mt="4">
            <Button w="30px" as={Link} to=".." relative="path">
              <ArrowBackIcon color="white.500" />
            </Button>
            <Text ml="2" fontSize="lg">
              {
                crumbs[crumbs.length - 1]?.[
                  crumbs[crumbs.length - 1]?.length - 1
                ]?.name
              }
            </Text>
            <Spacer />
            {/* <IconButton aria-label="Refresh content" icon={<FaArrowsRotate/>} onClick={() => refetch()}>Refetch</IconButton> */}
          </Flex>
        )}
        <Outlet />
      </Flex>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}

export default App;
