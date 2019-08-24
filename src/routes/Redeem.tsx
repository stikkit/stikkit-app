import { Contract } from "ethers";
import React, { useContext, useState, useEffect } from "react";
import { Stikker } from "../components/Stikker";
import ProviderContext from "../utils/TemporaryProviderContext";
import { Link } from "react-router-dom";

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
  const [data, setData] = useState();
  const [done, setDone] = useState(false);
  const provider = useContext(ProviderContext);

  const contract = new Contract(STIKKIT_CONTRACT, abi, provider.getSigner());

  async function loadData(tokenURI: string) {
    try {
      const request = await fetch(tokenURI);
      const data = await request.json();

      const foo = {
        name: data.properties.name.description,
        image: data.properties.image.description,
        description: data.properties.description.description
      };

      setData(foo);
    } catch (e) {}
  }

  async function awardItem(tokenURI: string) {
    const address = await provider.getSigner().getAddress();

    console.log("Signer Address", address);

    setLoading(true);

    const receipt = await contract.awardItem("https://fuck.yeah");

    console.log("Tx:", receipt);

    setLoading(false);
    setDone(true);
  }

  useEffect(() => {
    const tokenURI = decodeURIComponent(
      new URLSearchParams(location.search.substr(1)).get("token") || ""
    );

    if (!tokenURI) {
      history.push("/");
      return;
    }

    loadData(tokenURI);
    awardItem(tokenURI);
  }, []);

  return (
    <div className="screen">
      <div className="content content--centered">
        {!!data && (
          <>
            <Stikker done={done} loading={loading} image={data.image}></Stikker>
            <h2>{data.name}</h2>
            <p>{data.description}</p>
          </>
        )}
        {!done ? (
          <>
            <h3>What?!</h3>
            <p>
              You just claimed a stikker! We're reserving it for you, wait a few
              seconds or come back later to put it on your laptop
            </p>
          </>
        ) : (
          <>
            <h3>Done!</h3>
            <p>Now put it on your laptop before you lose it!</p>
          </>
        )}
      </div>
      {loading ? (
        <div className="bigLoader">Reserving your stikker…</div>
      ) : (
        <>
          {/* <button className="fullBtn">Stikk it nao!</button> */}
          <Link to="/" className="fullBtn fullBtn--secondary">
            Cool.
          </Link>
        </>
      )}
    </div>
  );
};
