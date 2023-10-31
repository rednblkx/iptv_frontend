import { ArrowBackIcon, CloseIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Progress,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import {
  Form,
  Link,
  Outlet,
  Params,
  useLocation,
  useMatches,
  useNavigation,
  useParams,
  useRouteLoaderData,
  useSubmit,
} from "react-router-dom";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import { LoaderParams } from "./apis/loader";
import searchShow from "./apis/SearchShow";
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
  const params = useParams();
  const [value, setValue] = useState("");
  let submit = useSubmit();

  const routeLoader = useRouteLoaderData("vodShows");

  const [searchEnabled, setSearch] = useState(false);
  useEffect(() => {
    setSearch(routeLoader?.options?.data.searchEnabled);
  }, [routeLoader]);
  const debounced = useDebouncedCallback((val) => {
    submit(
      { query: val },
      {
        method: "POST",
        action: `/vod/${params?.provider}`,
        encType: "application/json",
      }
    );
  }, 1500);

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setValue(event.target.value);
    debounced(event.target.value);
  };

  const submitData = (val: string) =>
    submit(
      { query: val },
      {
        method: "POST",
        action: `/vod/${params?.provider}`,
        encType: "application/json",
      }
    );

  // const { data, refetch } = useQuery(
  //   { ...query[0] || getProvidersQuery(), enabled: Boolean(query.length > 0) },
  //   queryClient
  // );
  return (
    <>
      <Background />
      <Flex flexDir="column" h="100dvh">
        <Toolbar />
        {(navigation.state == "loading" ||
          navigation.state == "submitting") && (
          <Progress size="xs" isIndeterminate />
        )}
        {location.pathname != "/" && (
          <Flex align="center" mx="5" mb="4" mt="4">
            <Button w="30px" as={Link} to={".."} relative="path">
              <ArrowBackIcon color="white.500" />
            </Button>
            <Text ml="2" fontSize="lg">
              {
                crumbs[crumbs.length - 1]?.[
                  crumbs[crumbs.length - 1]?.length - 1
                ]?.name
              }
            </Text>
            <Spacer />{" "}
            {searchEnabled && (
              <Flex justifyContent="center">
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon />
                  </InputLeftElement>
                  <Input
                    value={value}
                    onChange={handleChange}
                    onKeyUp={(ev) => {
                      if (ev.key == "Enter") {
                        debounced.cancel();
                        submitData(ev.currentTarget.value)
                      }
                    }}
                    type="search"
                    placeholder="Search a show"
                    // _placeholder={{ color: "inherit" }}
                  />
                  <InputRightElement width="3rem">
                    <IconButton aria-label="Clear field" variant={"ghost"} icon={<CloseIcon/>} h="1.75rem" size="sm" onClick={() => { setValue("");  submitData("")}}/>
                  </InputRightElement>
                </InputGroup>
              </Flex>
            )}
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
