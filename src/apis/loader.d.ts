import { LoaderFunctionArgs, Params } from "react-router-dom";

interface LoaderParams extends LoaderFunctionArgs {
  [x: string]: any;
  params: {
    provider?: string,
    show?: string,
    channel?: string,
    epid?: string
  }
}