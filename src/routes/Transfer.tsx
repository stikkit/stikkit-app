import React, { useState, useEffect } from "react";
import Portis from "@portis/web3";
import { providers } from "ethers";

const portis = new Portis("0d20faae-038a-49da-8085-53ea5e3faba1", "rinkeby");
const portisProvider = new providers.Web3Provider(portis.provider);

export const Transfer = ({ immediate }: { immediate?: boolean }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  async function checkLogin() {
    const addresses = await portisProvider.listAccounts();
    setLoggedIn(addresses.length > 0);
  }

  useEffect(() => {
    portis.logout();
    //checkLogin();
  }, []);
  return (
    <div>
      <h1>Transfer your token</h1>
      {loggedIn ? (
        "loggedin"
      ) : (
        <button
          onClick={e => {
            e.preventDefault();
            portis.showPortis();
          }}
          className="fullBtn"
        >
          Log in with username and password
        </button>
      )}
    </div>
  );
};
