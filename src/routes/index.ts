/* eslint-disable import/prefer-default-export */
import * as express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import pgPromise from 'pg-promise';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface DataImage {
  fileSizeBytes: number,
  url: string
}
const url = process.env.URL;
console.log(url);

async function sendRequest() {
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  const match = new RegExp(/\.(jpg|JPG|png|PNG|gif|jpeg)/g);
  if (!match.test(data.url)) {
    return sendRequest();
  }
  return data.url;
}

export const register = (app: express.Express): void => {
  const port = parseInt(process.env.PGPORT, 10);
  const config = {
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port,
    user: process.env.PGUSER,
  };

  const pgp = pgPromise();
  const db = pgp(config);

  app.get('/', (_req: unknown, res) => {
    res.render('index', {
      title: 'Hey', message: 'Hello there!', getImage: '/image', listImages: '/list/dog/images',
    });
  });

  app.post('/upload/dog/image', async (req, res) => {
    console.log(req.body);
    try {
      const id = await db.one(`
                INSERT INTO images( url, width, height )
                VALUES( $[url], $[width], $[height])
                RETURNING id;`,
      { ...req.body });
      return res.json({ id });
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({ error: err.message || err });
    }
  });

  app.get('/image', async (_req, res) => {
    const imageUrl = await sendRequest();
    res.render('image', { getURI: 'Hey', url: imageUrl });
  });

  app.get('/list/dog/images', async (req: any, res) => {
    try {
      const images = await db.any(`
                SELECT
                    id
                    , url
                    , width
                    , height
                FROM    images
                ORDER BY id`);
      console.log(images);
      return res.json( images );
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({ error: err.message || err });
    }
  });

  app.get('/list/dog/images/view', async (req: any, res) => {
    try {
      const images = await db.any(`
                SELECT
                    id
                    , url
                    , width
                    , height
                FROM    images
                ORDER BY id`);
      res.render('list', { results: images });
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({ error: err.message || err });
    }
  });

  app.get('/list/dog/images/remove/:id', async (req: any, res) => {
    try {
      const id = await db.result(`
                DELETE
                FROM    images
                WHERE   id = $[id]`,
      { id: req.params.id }, (r) => r.rowCount);
      return res.json({ id });
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.json({ error: err.message || err });
    }
  });
};
