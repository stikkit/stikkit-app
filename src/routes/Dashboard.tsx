import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Contract } from "ethers";

import ProviderContext from "../utils/TemporaryProviderContext";
import Spinner from "../components/Spinner";
import { Stikker } from "../components/Stikker";
import Logo from "../assets/logo.svg";

const STIKKIT_CONTRACT = "0x0221fF31e1Bd6Da423664e079e3f6fd3A7fe6aDB";
const abi = [
  "function balanceOf(address owner) public view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
  "function tokenURI(uint256 tokenId) external view returns (string memory)"
];

export const Dashboard = () => {
  const provider = useContext(ProviderContext);
  const contract = new Contract(STIKKIT_CONTRACT, abi, provider.getSigner());
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const getMyBadges = async () => {
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
                if(!badges.find(x => x.tokenId === parsed.tokenId)) {
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
    };

    getMyBadges();
  }, []);

  console.log(badges)

  return (
    <>
      <header className="header">
        <img className="logo" src={Logo} alt="" />
      </header>
      <div className="screen">
        <div className="content">
          <h1 className="content__title">My Stikkers</h1>
          <div className="itemGrid">
            {badges.length === 0 && <Spinner />}
            {badges
              .map(badge => {
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
              })}
          </div>
        </div>
      </div>
    </>
  );
};
