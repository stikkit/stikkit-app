//@ts-ignore
import { GSNProvider } from "@openzeppelin/gsn-provider";
import { providers } from "ethers";
import React from "react";
//@ts-ignore
import Web3 from "web3";

export const createProvider = () => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://rinkeby.infura.io/v3/c12569e379fe4f67803d24a983324fa5"
    )
  );

  if (localStorage.getItem("PRIVATE_KEY")) {
    web3.eth.accounts.privateKeyToAccount(localStorage.getItem("PRIVATE_KEY"));
  } else {
    const wallet = web3.eth.accounts.create();
    localStorage.setItem("PRIVATE_KEY", wallet.privateKey);
  }

  const gsnProvider = new GSNProvider(web3, {
    signKey: localStorage.getItem("PRIVATE_KEY")
  });

  return new providers.Web3Provider(gsnProvider);
};

const Context = React.createContext(createProvider());

export default Context;
