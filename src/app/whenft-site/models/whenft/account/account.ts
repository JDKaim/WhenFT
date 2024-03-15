import { NFT } from "../nft";

export interface Account {
    id: number;
    email: string;
    name: string;
    portfolio: Array<NFT>;
    coins: number;
    lastSpin: number;
}