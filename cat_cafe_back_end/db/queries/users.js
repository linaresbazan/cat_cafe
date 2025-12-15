// TODO -
import db from "#db/client";
import bcrypt from "bcrypt";

/** @returns a user created according to the provided details */
export async function createUser({ username, password, firstName, lastName, phone, email, isAdmin }) {
  const sql = `
    INSERT INTO users (username, password, first_name, last_name, phone, email, is_admin)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
  const hashedPassword = await bcrypt.hash(password, 10);
  const values = [username, hashedPassword, firstName, lastName, phone, email, isAdmin];
  const { rows: user } = await db.query(sql, values);
  return user[0];
}

//*********************************************************

/** @returns a user according to the provided details */
export async function getUser({ username }) {
  const sql = `
    SELECT *
    FROM users
    WHERE username = $1`;
  const values = [username];
  const { rows: user } = await db.query(sql, values);

  if (user.length === 0) return undefined;
  return user[0];
}
/** @returns a user by id */
export async function getUserById({ id }) {
  const sql = `
    SELECT *
    FROM users
    WHERE id = $1`;
  const values = [id];
  const { rows: user } = await db.query(sql, values);

  if (user.length === 0) return undefined;
  return user[0];
}

/**
 * @returns the updated user with the given id
 * @returns undefined if user with the given id does not exist
 */
export async function updateUser({id, username, password, firstName, lastName, email }) {
  const sql = `UPDATE users
    SET password = $1, first_name = $2, last_name= $3, email = $4
    WHERE username = $5 AND id = $6
    RETURNING *`;
  const values = [password, firstName, lastName, email, username, id ];
  const { rows: users } = await db.query(sql, values);
  if (!users) return undefined;
  return users[0];
}

/**
 * @returns the deleted user with the given id
 * @returns undefined if user with the given id does not exist
 */
export async function deleteUser({ id }) {
  const sql = `
  DELETE FROM users
  WHERE id = $1 RETURNING *`;
  const values = [id];
  const { rows: users } = await db.query(sql, values);
  if (!users) return undefined;
  return users[0];
}