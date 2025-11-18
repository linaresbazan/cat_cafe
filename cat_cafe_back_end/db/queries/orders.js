// TODO
import db from "#db/client";

/** @returns order created according to the provided details */
export async function createOrder({ userId, date }) {
  const sql = `
    INSERT INTO orders (user_id, date) 
    VALUES ($1, $2) RETURNING *`;
  const values = [ userId, date];
  const { rows: orders } = await db.query(sql, values);
  return orders[0];
}

/** @returns orders_menu_items created according to the provided details */
export async function addMenuItemsToOrder({ orderId, menuItemId, quantity }) {
  const sql = `
    INSERT INTO orders_menu_items (order_id, menu_item_id, quantity) 
    VALUES ($1, $2, $3) RETURNING *`;
  const values = [orderId, menuItemId, quantity];
  const { rows: orders_menu_items } = await db.query(sql, values);
  return orders_menu_items[0];
}

/** @returns all orders */
export async function getOrders() {
  const sql = `SELECT * FROM orders`;
  const { rows: orders } = await db.query(sql);
  return orders;
}

/** @returns all orders by userId */
export async function getOrdersByUserId({ userId }) {
  const sql = `
  SELECT * 
  FROM orders 
  WHERE user_id = $1`;
  const values = [userId];
  const { rows: orders } = await db.query(sql, values);
  return orders;
}

/** @returns a specific order */
export async function getOrderByOrderId({ id }) {
  const sql = `
  SELECT * 
  FROM orders 
  WHERE id = $1`;
  const values = [id];
  const { rows: orders } = await db.query(sql, values);
  if (!orders) return undefined;
  return orders[0];
}

/** @returns all menu_items from an order */
export async function getOrderMenuItemsByOrderId({ orderId }) {
  const sql = `
  SELECT omi.*, mi.*
  FROM orders_menu_items AS omi
  JOIN menu_items AS mi ON omi.menu_item_id = mi.id
  WHERE omi.order_id = $1`;
  const values = [orderId];
  const { rows: order_menu_items } = await db.query(sql, values);
  return order_menu_items;
}

/**
 * @returns the deleted order with the given id
 * @returns undefined if order with the given id does not exist
 */
export async function deleteOrder({ id }) {
  const sql = `
  DELETE FROM orders
  WHERE id = $1 RETURNING *`;
  const values = [id];
  const { rows: orders } = await db.query(sql, values);
  if (!orders) return undefined;
  return orders[0];
}