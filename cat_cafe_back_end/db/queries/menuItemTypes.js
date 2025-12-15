import db from "#db/client";

/** @returns a menu_item_type according to the provided details */
export async function addMenuItemType({ menuItemType }) {
  const sql = `
    INSERT INTO menu_item_types (type) 
    VALUES ($1) RETURNING *`;
  const values = [menuItemType];
  const { rows: menu_item_types } = await db.query(sql, values);
  return menu_item_types[0];
}

/** @returns all menu_item_types */
export async function getMenuItemTypes() {
  const sql = `SELECT * FROM menu_item_types`;
  const { rows: menu_item_types } = await db.query(sql);
  return menu_item_types;
}

/** @returns a specific menu_item_type */
export async function getMenuItemType({ id }) {
  const sql = `
      SELECT *
      FROM menu_item_types
      WHERE id = $1`;
  const values = [id];
  const { rows: menu_item_types } = await db.query(sql, values);
  if (!menu_item_types) return undefined;
  return menu_item_types[0];
}

  /**
   * @returns the updated menu_item_type with the given id
   * @returns undefined if menu_item_type with the given id does not exist
   */
export async function updateMenuItemType({id, menuItemType }) {
  const sql = `UPDATE menu_item_types
  SET type = $2,
  WHERE id = $1
  RETURNING *`;
  const values = [ id, menuItemType ];
  const { rows: menu_item_types } = await db.query(sql, values);
  if (!menu_item_types) return undefined;
  return menu_item_types[0];
}

/**
 * @returns the deleted menu_item_type with the given id
 * @returns undefined if menu_item_type with the given id does not exist
 */
export async function deleteMenuItemType({ id }) {
  const sql = `
  DELETE FROM menu_item_types
  WHERE id = $1 RETURNING *`;
  const values = [id];
  const { rows: menu_item_types } = await db.query(sql, values);
  if (!menu_item_types) return undefined;
  return menu_item_types[0];
}