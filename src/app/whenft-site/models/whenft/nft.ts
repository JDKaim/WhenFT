import { Account } from './account/account';
import { Pixel } from './pixel';
import { Row } from './row';

export interface NFT {
  id: number;
  rows: Array<Row>;
  owner?: Account;
}
