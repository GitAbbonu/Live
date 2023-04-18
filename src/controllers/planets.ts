import { Request, Response } from "express";
import Joi from "joi";

import pgPromise from "pg-promise";
//postgres://username:password
const db = pgPromise()("postgres://postgres:root@localhost:5432/postgres");

const setupDB = async () => {
  await db.none(`
    DROP TABLE IF EXISTS planets;

    CREATE TABLE planets (
      id SERIAL NOT NULL PRIMARY KEY,
      name TEXT NOT NULL
    )
  `);

  await db.none(`INSERT INTO planets (name) VALUES ('Earth')`);
  await db.none(`INSERT INTO planets (name) VALUES ('Mars')`);
};

setupDB();

//CRUD
async function getAll(req: Request, res: Response) {
  const planets = await db.many(`SELECT * FROM planets;`);
  res.status(200).json(planets);
}

async function getByID(req: Request, res: Response) {
  const { id } = req.params;

  const planet = await db.oneOrNone(
    `SELECT * FROM planets WHERE id=$1;`,
    Number(id)
  );

  res.status(200).json(planet);
}

const planetSchemaBody = Joi.object({
  name: Joi.string().required(),
});

async function create(req: Request, res: Response) {
  const { name } = req.body;

  const newPlanet = { name };

  const validation = planetSchemaBody.validate(newPlanet);

  if (validation.error) {
    res.status(400).json({ msg: "error 400" });
  } else {
    await db.none(`INSERT INTO planets (name) VALUES ($1)`, name);
    // planets = [...planets, newPlanet];
    res.status(200).json({ msg: "create new Planet" });
  }
}

async function updateByID(req: Request, res: Response) {
  const { id } = req.params;
  const { name } = req.body;

  // planets = planets.map((p) => (p.id === Number(id) ? { ...p, name } : p));
  await db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [id, name]);

  res.status(200).json({ msg: "updato" });
}

async function deleteByID(req: Request, res: Response) {
  const { id } = req.params;
  // planets = planets.filter((p) => p.id !== Number(id));
  await db.none(`DELETE FROM planets WHERE id=$1`, Number(id));

  res.status(200).json({ msg: "The planet was deleted." });
}

export { getAll, getByID, create, updateByID, deleteByID };
