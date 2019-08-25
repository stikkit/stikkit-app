//@ts-ignore
import { providers } from "ethers";
import React from "react";
import Portis from "@portis/web3";

export const portis = new Portis(
  "0d20faae-038a-49da-8085-53ea5e3faba1",
  "rinkeby"
);

export const createProvider = () => {
  return new providers.Web3Provider(portis.provider);
};

const Context = React.createContext(createProvider());

export default Context;
