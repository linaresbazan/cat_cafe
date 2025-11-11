// TODO
import db from "#db/client";

/** @returns a cat 🐈 according to the provided details */
export async function addCat({ name, age, sex, breed, description }) {
  const sql = `
    INSERT INTO cats (name, age, sex, breed, description) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const values = [name, age, sex, breed, description];
  const { rows: cats } = await db.query(sql, values);
  return cats[0];
}

/** @returns all cats 🐈🐈‍⬛🐱 */
export async function getCats() {
  const sql = `SELECT * FROM cats`;
  const { rows: cats } = await db.query(sql);
  return cats;
}

/** @returns a specific cat 🐈 */
export async function getCat({ id }) {
  const sql = `
    SELECT * 
    FROM cats
    WHERE id = $1`;
  const values = [id];
  const { rows: cats } = await db.query(sql, values);
  if (!cats) return undefined;
  return cats[0];
}

/**
 * @returns the updated cat 🐈 with the given id
 * @returns undefined if cat 🐈 with the given id does not exist
 */
export async function updateCat({id, name, age, sex, breed, description }) {
  const sql = `UPDATE cats
    SET name = $2, age = $3, sex = $4, breed = $5, description = $6
    WHERE id = $1
    RETURNING *`;
  const values = [ id, name, age, sex, breed, description ];
  const { rows: cats } = await db.query(sql, values);
  if (!cats) return undefined;
  return cats[0];
}

/**
 * @returns the removed cat 🐈 with the given id
 * @returns undefined if cat 🐈 with the given id does not exist
 */
export async function removeCat({ id }) {
  const sql = `
  DELETE FROM cats
  WHERE id = $1 RETURNING *`;
  const values = [id];
  const { rows: cats } = await db.query(sql, values);
  if (!cats) return undefined;
  return cats[0];
}
