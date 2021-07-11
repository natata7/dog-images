import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import * as routes from './routes';
import * as swaggerDocument from './docs/swagger.json';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded());

app.use(cors());
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

routes.register(app);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Running on port ${port}`));
