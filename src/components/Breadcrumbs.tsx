import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
} from "@chakra-ui/react";
import { Link, Params, useLocation, useMatches } from "react-router-dom";
import { LoaderParams } from "../apis/loader";

export function Breadcrumbs() {
  let matches = useMatches() as {
    id: string;
    pathname: string;
    params: Params<string>;
    data: LoaderParams;
    handle: {
      crumb: (data: LoaderParams) => {
        id: string;
        name: any;
      }[];
    };
  }[];
  let location = useLocation();
  let crumbs = matches
    // first get rid of any matches that don't have handle and crumb
    .filter((match) => Boolean(match.handle?.crumb))
    // now map them into an array of elements, passing the loader
    // data to each one
    .map((match) => match.handle.crumb(match.data));  

  return (
    <Breadcrumb
      pl="5"
      overflow={["auto"]}
      // pt="2"
      // pb="5"
      separator={<ChevronRightIcon color="gray.500" />}
    >
      <BreadcrumbItem>
        <BreadcrumbLink as={Link} to="/">
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>
      {crumbs.map((crumb, _, array) =>
        crumb.map((a, i) => (
          <BreadcrumbItem key={i} isCurrentPage={i == array.length - 1}>
            <BreadcrumbLink as={Link} to={location.pathname.substring(0, location.pathname.indexOf(a.id) + a.id.length)} state={{ ...location.state }}>
              <Text noOfLines={1}>{a.name}</Text>
            </BreadcrumbLink>
          </BreadcrumbItem>
        ))
      )}
    </Breadcrumb>
  );
}
