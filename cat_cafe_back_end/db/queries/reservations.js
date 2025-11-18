// TODO

import db from "#db/client";
import { addMinutes } from "#utils/common";

const MAX_CAPACITY = process.env.MAX_CAPACITY ?? 5;

/** @returns reservation record created according to the provided details */
export async function createReservationRecord({ userId, reservationTypeId, startTime, timeLength }) {
  const endTime = addMinutes(new Date(startTime), timeLength);
  const sql = `
    INSERT INTO reservations (user_id, reservation_type_id, start_time, end_time ) 
    VALUES ($1, $2, $3, $4) RETURNING *`;
  const values = [ userId, reservationTypeId, startTime, endTime ];
  const { rows: reservations } = await db.query(sql, values);
  return reservations[0];
}
/** @returns reservation created according to the provided details */
export async function createReservation({ userId, reservationTypeId, startTime }) {
  try {
    await db.query('BEGIN'); // Start transaction

    const reservationTypeTimeLengthSql = `SELECT time_length FROM reservation_types 
             WHERE id = $1`;
    const reservationTypeTimeLengthValues = [reservationTypeId];
    const reservationTypeTimeLengthResult = await db.query(reservationTypeTimeLengthSql, reservationTypeTimeLengthValues);
    const reservationTypeTimeLength = parseInt(reservationTypeTimeLengthResult.rows[0].time_length);

    const endTime = addMinutes(new Date(startTime), reservationTypeTimeLength);
    const reservationCountSql = `SELECT COUNT(*) FROM reservations 
             WHERE (start_time, end_time) OVERLAPS ($1::timestamp with time zone, $2::timestamp with time zone)`;
    const reservationCountValues = [startTime, endTime];
    // 1. Check current reservations within the desired time slot
    // SELECT FOR UPDATE locks the selected rows, preventing other transactions from modifying or locking them until this transaction commits.
    const countResult = await db.query(reservationCountSql, reservationCountValues);

    const currentReservations = parseInt(countResult.rows[0].count);

    if (currentReservations >= MAX_CAPACITY) {
      await db.query('ROLLBACK'); // Rollback if full
      return undefined;
    } else {
      // 2. Insert the new reservation
      const reservation = await createReservationRecord({ userId, reservationTypeId, startTime, timeLength: reservationTypeTimeLength });
      await db.query('COMMIT'); // Commit if successful
      return reservation;
    }

  } catch (error) {
    await db.query('ROLLBACK'); // Rollback in case of any error
    console.error('Reservation error:', error);
    throw error;
  }
}
//
// /** @returns orders_menu_items created according to the provided details */
// export async function createOrderMenuItems({ orderId, menuItemId, quantity }) {
//   const sql = `
//     INSERT INTO orders_products (order_id, menu_item_id, quantity)
//     VALUES ($1, $2, $3) RETURNING *`;
//   const values = [orderId, menuItemId, quantity];
//   const { rows: orders_menu_items } = await db.query(sql, values);
//   return orders_menu_items[0];
// }

/** @returns all reservations */
export async function getReservations() {
  const sql = `SELECT * FROM reservations`;
  const { rows: reservations } = await db.query(sql);
  return reservations;
}

/** @returns all reservations by user_id */
export async function getReservationsByUserId({ userId }) {
  const sql = `
  SELECT * 
  FROM reservations 
  WHERE user_id = $1`;
  const values = [userId];
  const { rows: reservations } = await db.query(sql, values);
  return reservations;
}

/** @returns a specific reservation */
export async function getReservationByReservationId({ id }) {
  const sql = `
  SELECT * 
  FROM reservations 
  WHERE id = $1`;
  const values = [id];
  const { rows: reservations } = await db.query(sql, values);
  if (!reservations) return undefined;
  return reservations[0];
}

// /** @returns all menu_items from an order */
// export async function getOrderMenuItemsByOrderId({ order_id }) {
//   const sql = `
//   SELECT p.*
//   FROM orders_menu_items AS omi
//   JOIN menu_items AS mi ON omi.menu_item_id = mi.id
//   WHERE omi.order_id = $1`;
//   const values = [order_id];
//   const { rows: order_menu_items } = await db.query(sql, values);
//   return order_menu_items;
// }

/**
 * @returns the deleted reservation with the given id
 * @returns undefined if reservation with the given id does not exist
 */
export async function deleteReservation({ id }) {
  const sql = `
  DELETE FROM reservations
  WHERE id = $1 RETURNING *`;
  const values = [id];
  const { rows: reservations } = await db.query(sql, values);
  if (!reservations) return undefined;
  return reservations[0];
}