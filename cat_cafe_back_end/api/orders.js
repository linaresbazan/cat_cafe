import express from "express";
import requireUser from "#middleware/requireUser";
import getUserFromToken from "#middleware/getUserFromToken";
import {
  addMenuItemsToOrder,
  createOrder,
  deleteOrder,
  getOrderMenuItemsByOrderId,
  getOrders,
  getOrdersByUserId
} from "#db/queries/orders";
import requireBody from "#middleware/requireBody";
import checkOrderExists from "#middleware/checkOrderExists";
import checkOrderUserMatches from "#middleware/checkOrderUserMatches";
import checkMenuItemExists from "#middleware/checkMenuItemExists";

const router = express.Router();
export default router;

/**
 * Returns all orders for a specific user
 * Returns all orders if admin
 */
router.get('/', getUserFromToken, requireUser, async (req, res) => {
  const user = req.user;
  const { is_admin: isAdmin } = user;
  let orders;
  if (isAdmin) orders = await getOrders();
  else orders = await getOrdersByUserId({ userId: user.id });

  return res.status(200).send(orders);
});

/** creates an order */
router.post("/", getUserFromToken, requireUser, requireBody(["date"]), async (req, res) => {
  const { date } = req.body;

  const user = req.user;

  const order = await createOrder({userId: user.id, date});

  if (!order) return res.status(400).send("Could not create order");
  return res.status(201).send(order);
});

/** Deletes a menu_item */
router.delete('/:id', getUserFromToken, requireUser, checkOrderExists, async (req, res) => {
  if (!req.order) return res.status(404).send("Order not found");
  const { id } = req.params;
  const user = req.user;
  const { is_admin: isAdmin } = user;

  if (!isAdmin) return res.status(403).send("Action not allowed");

  const order = await deleteOrder({ id });
  return res.status(200).send(order);
});

/** adds a menu item to an order */
router.post("/:id/menu-items", getUserFromToken, requireUser, checkOrderExists, checkOrderUserMatches, requireBody(["menuItemId", "quantity"]), checkMenuItemExists, async (req, res) => {
  const { menuItemId, quantity } = req.body;
  const { id: orderId } = req.order;

  const orderProduct = await addMenuItemsToOrder({ orderId, menuItemId, quantity });
  if (!orderProduct) return res.status(400).send("Could not add product to order");

  return res.status(201).send(orderProduct);

});

/** gets menuItems from an order */
router.get("/:id/menu-items", getUserFromToken, requireUser, checkOrderExists, checkOrderUserMatches, async (req, res) => {
  const { id: orderId } = req.order;
  const orderMenuItems = await getOrderMenuItemsByOrderId({ orderId });
  return res.status(200).send(orderMenuItems);
});
