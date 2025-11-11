// TODO
import db from "#db/client";

/** @returns a reservation_type according to the provided details */
export async function addReservationType({ type, description, cost, timeLength }) {
  const sql = `
    INSERT INTO reservation_types (type, description, cost, time_length) 
    VALUES ($1, $2, $3, $4) RETURNING *`;
  const values = [type, description, cost, timeLength];
  const { rows: reservation_types } = await db.query(sql, values);
  return reservation_types[0];
}

/** @returns all reservation_types */
export async function getReservationTypes() {
  const sql = `SELECT * FROM reservation_types`;
  const { rows: reservation_types } = await db.query(sql);
  return reservation_types;
}

/** @returns a specific reservation_type */
export async function getReservationType({ id }) {
  const sql = `
    SELECT * 
    FROM reservation_types
    WHERE id = $1`;
  const values = [id];
  const { rows: reservation_types } = await db.query(sql, values);
  if (!reservation_types) return undefined;
  return reservation_types[0];
}

/**
 * @returns the updated reservation_type with the given id
 * @returns undefined if reservation_type with the given id does not exist
 */
export async function updateReservationType({id, type, description, cost, timeLength }) {
  const sql = `UPDATE reservation_types
    SET type = $2, description = $3, cost = $4, time_length = $5
    WHERE id = $1
    RETURNING *`;
  const values = [ id, type, description, cost, timeLength ];
  const { rows: reservation_types } = await db.query(sql, values);
  if (!reservation_types) return undefined;
  return reservation_types[0];
}

/**
 * @returns the removed reservation_type with the given id
 * @returns undefined if reservation_type with the given id does not exist
 */
export async function deleteReservationType({ id }) {
  const sql = `
  DELETE FROM reservation_types
  WHERE id = $1 RETURNING *`;
  const values = [id];
  const { rows: reservation_types } = await db.query(sql, values);
  if (!reservation_types) return undefined;
  return reservation_types[0];
}

