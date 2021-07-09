import fs from 'fs-extra';
import { Client } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const init = async () => {
  const client = new Client();
  try {
    await client.connect();
    // init db from file
    const sql = await fs.readFile(`${__dirname}/initdb.pgsql`, { encoding: 'UTF-8' });
    const statements = sql.split(/;\s*$/m);
    // eslint-disable-next-line no-restricted-syntax
    for (const statement of statements) {
      if (statement.length > 3) {
        // execute each of the statements
        // eslint-disable-next-line no-await-in-loop
        await client.query(statement);
      }
    }
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    // close the database client
    await client.end();
  }
};

init().then(() => {
  console.log('finished');
}).catch(() => {
  console.log('finished with errors');
});
