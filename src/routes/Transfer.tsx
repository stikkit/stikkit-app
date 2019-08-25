import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { Stikker } from "../components/Stikker";
import { useContract } from "../utils/contract";
import PortisProviderContext from "../utils/PortisProviderContext";

export const Transfer = ({
  immediate,
  match,
  history
}: {
  immediate?: boolean;
  match?: any;
  history: any;
}) => {
  const portisProvider = useContext(PortisProviderContext);
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
    console.log("SAVED!");
    setLoading(false);
    setError("SAVED!!");
    setData(null);
    setTimeout(() => {
      history.push("/");
    }, 3000);
  };

  const burn = async (e: any) => {
    e.preventDefault();

    if (!window.confirm("Are you sure you want to burn this stikker?")) return;

    setLoading(true);

    const tx = await contract.burn(await contract.signer.getAddress(), index);
    console.log("Burned!");
    setLoading(false);
    setError("Burned!");
    setData(null);
    setTimeout(() => {
      window.location.replace("/");
    }, 3000);
  };

  useEffect(() => {
    getUri();
  }, []);

  return (
    <>
      <header className="header header--alt">
        <Link to="/">
          <img className="logo" src={Logo} alt="" />
        </Link>
      </header>
      <div className="screen">
        <div className="content content--centered">
          {error && <p>{error}</p>}
          {!!data && (
            <>
              <Stikker loading={loading} image={data.image}></Stikker>
              <h2>{data.name}</h2>
              <p className="description">{data.description}</p>
            </>
          )}
          <h3>What?!</h3>
          <p className="description">
            You need to stick your stikkers to a permanent account, otherwise
            they might get lost! If you don't like them, set them on fire!
          </p>
        </div>

        {loading ? (
          <div className="bigLoader">Loading…</div>
        ) : (
          isOwner && (
            <div className="binaryActions">
              <button className="fullBtn" onClick={transfer}>
                Save it
              </button>
              <button className="fullBtn fullBtn--bad" onClick={burn}>
                Burn it
              </button>
            </div>
          )
        )}
      </div>
    </>
  );
};
