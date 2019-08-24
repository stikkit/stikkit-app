import React, { useState, useEffect, useContext } from "react";
import Portis from "@portis/web3";
import { providers } from "ethers";
import ProviderContext from "../utils/TemporaryProviderContext";
import { useContract } from "../utils/contract";
import { Stikker } from "../components/Stikker";

const portis = new Portis("0d20faae-038a-49da-8085-53ea5e3faba1", "rinkeby");
const portisProvider = new providers.Web3Provider(portis.provider);

export const Transfer = ({
  immediate,
  match
}: {
  immediate?: boolean;
  match?: any;
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState();
  const [isOwner, setIsOwner] = useState(false);
  const index = match.params.id;
  const contract = useContract();

  const getUri = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Token id:", index);

      contract
        .ownerOf(index)
        .then(async (address: any) =>
          setIsOwner(address.toString() == (await contract.signer.getAddress()))
        );

      const tokenURI = await contract.tokenURI(index);

      console.log("Token uri:", tokenURI);

      const request = await fetch(tokenURI);
      const data = await request.json();

      console.log("Data", data);

      const foo = {
        name: data.properties.name.description,
        image: data.properties.image.description,
        description: data.properties.description.description
      };

      setData(foo);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setError("Oops there was an error…");
    }
  };

  const transfer = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const recipientAddress = await portisProvider.getSigner().getAddress();
    console.log("Recipient", recipientAddress);

    const tx = await contract.transferFrom(
      await contract.signer.getAddress(),
      recipientAddress,
      index
    );
    console.log("BURNED!");
    setLoading(false);
    setError("BURNED!!");
    setData(null);
  };

  const burn = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const tx = await contract.burn(
      await contract.signer.getAddress(),
      index
    );
    console.log("Burned!");
    setLoading(false);
    setError("Burned!");
    setData(null);
    localStorage.setItem("badges", JSON.stringify([]));
    setTimeout(() => {
      window.location.replace("/")
    }, 3000)
  };

  useEffect(() => {
    getUri();
  }, []);

  return (
    <div className="screen">
      <div className="content content--centered">
        {error && <p>{error}</p>}
        {loading && <h1>Loading…</h1>}
        {!!data && (
          <>
            <Stikker image={data.image}></Stikker>
            <h2>{data.name}</h2>
            <p>{data.description}</p>
          </>
        )}
      </div>

      {isOwner && (
        <div className="binaryActions">
          <button className="fullBtn" onClick={transfer}>
            Save it
          </button>
          <button className="fullBtn fullBtn--bad" onClick={burn}>
            Burn it
          </button>
        </div>
      )}
    </div>
  );
};
