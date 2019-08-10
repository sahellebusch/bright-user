import Promise from 'bluebird';
import Pgp from 'pg-promise';

const pgp = Pgp({
  capSQL: true,
  promiseLib: Promise
});

export default pgp;
