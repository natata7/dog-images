import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import * as routes from './routes';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded());

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

routes.register(app);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Running on port ${port}`));
