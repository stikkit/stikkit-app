import React, { useEffect, useContext, useState }  from "react";
import { Link } from "react-router-dom";
import { Contract } from "ethers";

import ProviderContext from "../utils/TemporaryProviderContext";
import Spinner from "../components/Spinner";

const STIKKIT_CONTRACT = "0x0221fF31e1Bd6Da423664e079e3f6fd3A7fe6aDB";
const abi = [
  "function balanceOf(address owner) public view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
  "function tokenURI(uint256 tokenId) external view returns (string memory)"
];

export const Dashboard = () => {
  const provider = useContext(ProviderContext);
  const contract = new Contract(STIKKIT_CONTRACT, abi, provider.getSigner());
  const [badges, setBadges] = useState <any []>([]);

  const onStorageEvent = (storageEvent : StorageEvent) => {
    if(storageEvent.newValue) {
      setBadges(JSON.parse(storageEvent.newValue));
    } else {
      setBadges([]);
    }
  }

  window.addEventListener('storage', onStorageEvent, false);

  useEffect(() => {
    const existingBadges = JSON.parse(localStorage.getItem('badges') || "")
    if(existingBadges) {
      setBadges(existingBadges)
    }

    const getMyBadges = async () => {
      const publicKey = await provider.getSigner().getAddress();
      const userBadgesCount = await contract.balanceOf(publicKey);
      const badges = [];
      if (userBadgesCount.toNumber() > 0) {
        for(let i = 0; i < userBadgesCount; i++) {
          let tokenId = await contract.tokenOfOwnerByIndex(publicKey, i);
          let tokenUri = await contract.tokenURI(tokenId.toNumber());
          let response = await fetch(tokenUri);
          let parsed = await response.json();
          badges[tokenId] = parsed;
        }
      }
      localStorage.setItem("badges", JSON.stringify(badges))
    }

    getMyBadges()
  }, [])

  return (
    <div className="screen">
      <h1>Your stikkers</h1>
      <div className="itemGrid">
        <Spinner />
        {badges.map((badge, index) => {
          if(badge) {
            return <div className="itemGrid__item" key={index}>
              <Link to={`/details/${index}`}>
                <img src={badge.properties.image.description} alt="" />
              </Link>
            </div>
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
};
