import { Alert, AlertDescription, AlertIcon, AlertTitle, Box } from "@chakra-ui/react";
import { useRouteError } from "react-router-dom";

export function ErrorElement() {
  let error = useRouteError();
  console.log(error);
  
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
      <AlertDescription>{(error as any)?.message + ` - ${(error as any)?.response?.data?.error}`}</AlertDescription>
    </Alert>
  </Box>
  )
}