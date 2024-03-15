import { Account } from "./account/account";
import { NFT } from "./nft";

export interface WhenFTModel {
    nfts: Array<NFT>;
    accounts: Array<Account>;
}