import dotenv from 'dotenv';
import path from 'path';
import pgPromise from 'pg-promise';
import { BaseImage, Image } from './image.interface';
import { Images } from './list.interface';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  connectionString: process.env.PGSTRING,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pgp = pgPromise();
const db = pgp(config);

export const findAll = async (): Promise<Images[]> => {
  const images = await db.any(`
                SELECT
                    id
                    , url
                    , width
                    , height
                FROM    images
                ORDER BY id`);
  return images;
};

export const find = async (id: number): Promise<Images> => {
  const images = await db.any(`
                SELECT
                *
                FROM    images
                WHERE id = $[id]`, { id });
  return images;
};

export const create = async (newItem: BaseImage): Promise<Image> => {
  const id = await db.one(`
                INSERT INTO images( url, width, height )
                VALUES( $[url], $[width], $[height])
                RETURNING id;`,
  { ...newItem });

  return id;
};

export const remove = async (id: number): Promise<null | true> => {
  const image = await find(id);
  if (!image) {
    return null;
  }

  await db.result(`
                DELETE
                FROM    images
                WHERE   id = $[id]`, { id });

  return true;
};
