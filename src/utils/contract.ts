import { useContext } from "react";
import ProviderContext from "../utils/TemporaryProviderContext";
import { Contract } from "ethers";

const STIKKIT_CONTRACT = "0x0221fF31e1Bd6Da423664e079e3f6fd3A7fe6aDB";

let abi = [
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "function awardItem(string tokenURI) public returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
  "function transferFrom(address from, address to, uint256 tokenId) public",
  "function tokenURI(uint256 tokenId) external view returns (string memory)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function burn(address owner, uint256 tokenId) public"
];

export const useContract = () => {
  const provider = useContext(ProviderContext);
  return new Contract(STIKKIT_CONTRACT, abi, provider.getSigner());
};
