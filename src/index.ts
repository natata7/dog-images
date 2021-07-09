import express from 'express';
import dotenv from 'dotenv';
import * as routes from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

routes.register(app);

app.listen(port, () => console.log(`Running on port ${port}`));
