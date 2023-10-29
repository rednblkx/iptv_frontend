import { Alert, AlertDescription, AlertIcon, AlertTitle, Box } from "@chakra-ui/react";
import { useRouteError } from "react-router-dom";

export function ErrorElement() {
  let error = useRouteError();
  return (
    <Box
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
  </Box>
  )
}