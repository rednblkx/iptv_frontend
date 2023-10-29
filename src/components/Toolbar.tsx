import {
  HamburgerIcon,
  Icon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons";
import {
  useDisclosure,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Box,
  Card,
  CardBody,
  Text,
  Button,
  useColorMode,
  Spacer,
} from "@chakra-ui/react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Breadcrumbs } from "./Breadcrumbs";

export default function Toolbar() {
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  const btnRef = React.useRef(null);
  const location = useLocation();

  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box
      display="flex"
      pos="sticky"
      top="0"
      flexShrink="0"
      zIndex={999}
      h="var(--toolbar-size)"
      bgColor={colorMode == "dark" ? "#332f2f" : "#cec9ad"}
      borderRadius="2px"
      alignContent="center"
      alignItems="center"
      shadow="sm"
      // mt="4px"
    >
      <IconButton
        ref={btnRef}
        aria-label="Menu"
        icon={<HamburgerIcon />}
        onClick={onDrawerOpen}
        alignSelf="center"
        ml="5"
      ></IconButton>
      <Breadcrumbs />
      <Spacer />
      <Button
        // variant="ghost"
        // shadow="sm"
        onClick={toggleColorMode}
        style={{ WebkitTapHighlightColor: "transparent" }}
        mx="5"
        // bg={colorMode === "dark" ? "blackAlpha.400" : "whiteAlpha.400"}
      >
        <Icon w="4" h="4" as={colorMode === "light" ? SunIcon : MoonIcon} />
      </Button>
      <Drawer
        isOpen={isDrawerOpen}
        placement="left"
        onClose={onDrawerClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Select category</DrawerHeader>

          <DrawerBody display="flex" flexDirection="column" gap={4}>
            <Card
              as={Link}
              to="/live"
              state={{ ...location.state, live: "Live TV" }}
            >
              <CardBody>
                <Text>Live TV</Text>
              </CardBody>
            </Card>
            <Card as={Link} to="/vod" state={{ ...location.state, vod: "VOD" }}>
              <CardBody>
                <Text>VOD</Text>
              </CardBody>
            </Card>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
