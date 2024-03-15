import { Account } from './account/account';
import { Pixel } from './pixel';

export interface Row {
  id: number;
  pixels: Array<Pixel>;
}
