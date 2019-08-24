import { Contract } from "ethers";
import React, { useContext, useState } from "react";
import { Stikker } from "../components/Stikker";
import ProviderContext from "../utils/TemporaryProviderContext";

const STIKKIT_CONTRACT = "0x0221fF31e1Bd6Da423664e079e3f6fd3A7fe6aDB";

let abi = ["function awardItem(string tokenURI) public returns (uint256)"];

export const Redeem = ({
  location,
  history
}: {
  location: any;
  history: any;
}) => {
  const [loading, setLoading] = useState(true);

  const provider = useContext(ProviderContext);

  async function foo() {
    let contract = new Contract(STIKKIT_CONTRACT, abi, provider.getSigner());

    provider
      .getSigner()
      .getAddress()
      .then(e => console.log("Signer address:", e));

    //contract.awardItem("https://fuck.yeah").then(console.log);
  }

  foo();

  return (
    <div className="screen">
      <div className="content content--centered">
        <h1>Claimed</h1>
        <Stikker
          loading={loading}
          image="http://placekitten.com/240/240"
        ></Stikker>
        <h2>Kitten stikker</h2>
      </div>
      {!loading && (
        <>
          <button className="fullBtn">Stikk it nao!</button>
          <button className="fullBtn fullBtn--secondary">Later…</button>
        </>
      )}
    </div>
  );
};
