// TODO
import db from "#db/client";

/** @returns a menu_item according to the provided details */
export async function addMenuItem({ name, description, unitPrice }) {
  const sql = `
    INSERT INTO menu_items (name, description, unit_price) 
    VALUES ($1, $2, $3) RETURNING *`;
  const values = [name,description, unitPrice];
  const { rows: menu_items } = await db.query(sql, values);
  return menu_items[0];
}

/** @returns all menu_items */
export async function getMenuItems() {
  const sql = `SELECT * FROM menu_items`;
  const { rows: menu_items } = await db.query(sql);
  return menu_items;
}

/** @returns a specific menu_item */
export async function getMenuItem({ id }) {
  const sql = `
      SELECT *
      FROM menu_items
      WHERE id = $1`;
  const values = [id];
  const { rows: menu_items } = await db.query(sql, values);
  if (!menu_items) return undefined;
  return menu_items[0];
}

  /**
   * @returns the updated menu_item with the given id
   * @returns undefined if menu_item with the given id does not exist
   */
export async function updateMenuItem({id, name, description, unitPrice }) {
  const sql = `UPDATE menu_items
  SET name = $2, description = $3, unit_price = $4,
  WHERE id = $1
  RETURNING *`;
  const values = [ id, name, description, unitPrice ];
  const { rows: menu_items } = await db.query(sql, values);
  if (!menu_items) return undefined;
  return menu_items[0];
}

/**
 * @returns the deleted menu_item with the given id
 * @returns undefined if menu_item with the given id does not exist
 */
export async function deleteMenuItem({ id }) {
  const sql = `
  DELETE FROM menu_items
  WHERE id = $1 RETURNING *`;
  const values = [id];
  const { rows: menu_items } = await db.query(sql, values);
  if (!menu_items) return undefined;
  return menu_items[0];
}