/* eslint-disable import/prefer-default-export */
import express, { Request, Response } from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import pgPromise from 'pg-promise';
import * as ImageService from '../images/image.service';
import { BaseImage } from '../images/image.interface';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const url = process.env.URL;

async function sendRequest() {
  const response = await fetch(url);
  const data = await response.json();
  const match = new RegExp(/\.(jpg|JPG|png|PNG|gif|jpeg)/g);
  if (!match.test(data.url)) {
    return sendRequest();
  }
  return data.url;
}

export const register = (app: express.Express): void => {
  // const port = parseInt(process.env.PGPORT, 10);
  const config = {
    connectionString: process.env.PGSTRING,
    ssl: {
      rejectUnauthorized: false,
    },
  };

  const pgp = pgPromise();
  const db = pgp(config);

  app.get('/', (_req: unknown, res) => {
    res.render('index', {
      title: 'Hey', message: 'Hello there!', getImage: '/image', listImages: '/list/dog/images/view',
    });
  });

  app.post('/upload/dog/image', async (req: Request, res: Response) => {
    console.log(req);
    try {
      const item: BaseImage = req.body;

      const newItem = await ImageService.create(item);

      res.status(201).json(newItem);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  app.get('/image', async (req: Request, res: Response) => {
    const imageUrl = await sendRequest();
    res.render('image', { getURI: 'Hey', url: imageUrl });
  });

  app.get('/list/dog/images', async (req: Request, res: Response) => {
    try {
      const images = await ImageService.findAll();
      res.status(200).json(images);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  app.get('/list/dog/images/view', async (req: Request, res: Response) => {
    try {
      const images = await ImageService.findAll();
      res.render('list', { results: images });
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.error(err);
      res.status(500).send(err.message);
    }
  });

  app.get('/list/dog/images/remove/:id', async (req: Request, res: Response) => {
    try {
      const id: number = parseInt(req.params.id, 10);
      await ImageService.remove(id);

      res.status(200).json(id);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
};
