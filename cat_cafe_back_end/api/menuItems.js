// TODO
import express from 'express';
import { addMenuItem, getMenuItems, updateMenuItem } from "#db/queries/menuItems";
import checkMenuItemExists from "#middleware/checkMenuItemExists";
import requireBody from "#middleware/requireBody";
import { deleteMenuItem } from "#db/queries/menuItems";

const router = express.Router();
export default router;

/** returns all menu_items */
router.get('/', async (req, res) => {
  const menuItems = await getMenuItems();

  return res.status(200).send(menuItems);
});

/** returns a specific menu_item */
router.get('/:id', checkMenuItemExists, async (req, res) => {
  if (!req.menuItem) return res.status(404).send("Menu item Not Found");
  return res.status(200).send(req.menuItem);
});

/** Adds a menu_item */
router.post('/', requireBody(["name", "description", "unitPrice"]), async (req, res) => {
  const { name, description, unitPrice } = req.body;

  const menuItem = await addMenuItem({ name, description, unitPrice });
  if (!menuItem) return res.status(400).send("Error adding menu_item");
  return res.status(201).send(menuItem);
});

/** Updates a menu_item */
router.put('/:id', requireBody(["name", "description", "unitPrice"]), async (req, res) => {
  const { id } = req.params;

  if (id != parseInt(id) || id < 0) return res.status(400).send("The provided id is not a positive integer.");

  const { name, description, unitPrice } = req.body;

  const menu_item = await updateMenuItem({ id, name, description, unitPrice });
  if (!menu_item) return res.status(404).send("Menu_item does not exist");

  return res.status(200).send(menu_item);
});

/** Deletes a menu_item */
router.delete('/:id', checkMenuItemExists, async (req, res) => {
  if (!req.menuItem) return res.status(404).send("Menu_item Not Found");
  const { id } = req.params;

  const menuItem = await deleteMenuItem({ id });
  return res.status(200).send(menuItem);
});