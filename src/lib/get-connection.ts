import {IDatabase} from 'pg-promise';
import pgp from './pgp';

export default function(url: string): IDatabase<unknown> {
  return pgp(url);
}
