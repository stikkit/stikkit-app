import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Contract } from "ethers";

import ProviderContext from "../utils/TemporaryProviderContext";
import PortisProviderContext, { portis } from "../utils/PortisProviderContext";
import Spinner from "../components/Spinner";
import { Stikker } from "../components/Stikker";
import Logo from "../assets/logo.svg";
import { useContract } from "../utils/contract";

export const Dashboard = () => {
  const provider = useContext(ProviderContext);
  const portisProvider = useContext(PortisProviderContext);
  const contract = useContract();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [badges, setBadges] = useState<any[]>([]);
  const [permanentBadges, setPermanentBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [permanentLoading, setPermanentLoading] = useState(true);

  const getMyBadges = async () => {
    try {
      setLoading(true);
      const publicKey = await provider.getSigner().getAddress();
      const userBadgesCount = await contract.balanceOf(publicKey);
      const newBadges = [];

      if (userBadgesCount.toNumber() > 0) {
        for (let i = 0; i < userBadgesCount; i++) {
          try {
            let tokenId = await contract.tokenOfOwnerByIndex(publicKey, i);
            let tokenUri = await contract.tokenURI(tokenId.toNumber());
            if (tokenUri.includes("ipfs.io")) {
              let response = await fetch(tokenUri);
              let parsed = await response.json();
              if (parsed && parsed.title && parsed.properties) {
                parsed.tokenId = tokenId.toNumber();
                if (!badges.find(x => x.tokenId === parsed.tokenId)) {
                  newBadges.push(parsed);
                }
                setBadges([...newBadges, ...badges]);
              }
            }
          } catch {
            continue;
          }
        }
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getPermanentBadges = async () => {
    setPermanentLoading(true);
    try {
      const portisConnectedContract = contract.connect(portisProvider);
      const publicKey = await portisProvider.getSigner().getAddress();
      const userBadgesCount = await portisConnectedContract.balanceOf(
        publicKey
      );
      const newBadges = [];

      if (userBadgesCount.toNumber() > 0) {
        for (let i = 0; i < userBadgesCount; i++) {
          try {
            let tokenId = await portisConnectedContract.tokenOfOwnerByIndex(
              publicKey,
              i
            );
            let tokenUri = await portisConnectedContract.tokenURI(
              tokenId.toNumber()
            );
            if (tokenUri.includes("ipfs.io")) {
              let response = await fetch(tokenUri);
              let parsed = await response.json();
              if (parsed && parsed.title && parsed.properties) {
                parsed.tokenId = tokenId.toNumber();
                if (!badges.find(x => x.tokenId === parsed.tokenId)) {
                  newBadges.push(parsed);
                }
                setPermanentBadges([...newBadges, ...badges]);
              }
            }
          } catch {
            continue;
          }
        }
      }
    } catch (e) {
      setLoading(false);
    }

    setPermanentLoading(false);
  };

  const checkPortis = async () => {
    const account = await portis.getExtendedPublicKey();
    setLoggedIn(!!account.result);
    if (!account.result) setPermanentLoading(false);
  };

  useEffect(() => {
    getMyBadges();
    checkPortis();
    loggedIn && getPermanentBadges();

    portis.onLogin(() => {
      setLoggedIn(true);
      getPermanentBadges();
    });
  }, []);

  const logIn = async (e: any) => {
    e.preventDefault();
    setLoggingIn(true);

    try {
      await portis.showPortis();
    } catch (e) {
      setLoggingIn(false);
    }
    setLoggingIn(false);
  };

  return (
    <>
      <header className="header">
        <img className="logo" src={Logo} alt="" />
      </header>
      <div className="screen">
        <div className="content">
          <h1 className="content__title">My Stikkers</h1>
          <h4>Claimed</h4>
          <div className="itemGrid">
            {badges.length
              ? badges.map(badge => {
                  return (
                    <div className="itemGrid__item" key={badge.tokenId}>
                      <Link to={`/details/${badge.tokenId}`}>
                        <Stikker
                          small
                          image={badge.properties.image.description}
                        ></Stikker>
                      </Link>
                    </div>
                  );
                })
              : !loading && <p>You don't have any claimed badges…</p>}
            {loading && <Spinner />}
          </div>
          <hr />
          <h4>Saved</h4>
          <div className="itemGrid">
            {permanentBadges.length
              ? permanentBadges.map(badge => {
                  return (
                    <div className="itemGrid__item" key={badge.tokenId}>
                      <Link to={`/details/${badge.tokenId}`}>
                        <Stikker
                          small
                          image={badge.properties.image.description}
                        ></Stikker>
                      </Link>
                    </div>
                  );
                })
              : !permanentLoading &&
                loggedIn && <p>You don't have any saved badges…</p>}
            {permanentLoading && <Spinner />}
          </div>
          {!loggedIn && !permanentLoading && (
            <button disabled={loggingIn} className="fullBtn" onClick={logIn}>
              {loggingIn
                ? "Look for the Portis popup!"
                : "Log in to see your saved badges!"}
            </button>
          )}
        </div>
      </div>
    </>
  );
};
