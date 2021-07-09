import * as express from 'express';
import fetch from 'node-fetch';

interface DataImage {
  fileSizeBytes: number,
  url: string
}
const url = 'https://random.dog/woof.json';

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

// eslint-disable-next-line import/prefer-default-export
export const register = (app: express.Express): void => {
  app.get('/', (_req: unknown, res) => {
    res.render('index', { title: 'Hey', message: 'Hello there!', getImage: '/image' });
  });

  app.post('/upload/dog/image', (_req, res) => {
    res.redirect('/');
  });

  app.get('/image', async (req, res) => {
    const imageUrl = await sendRequest();
    res.render('image', { getURI: 'Hey', url: imageUrl });
  });

  app.get('/list/dog/images', (_req: unknown, res) => {
    res.redirect('/');
  });
};
