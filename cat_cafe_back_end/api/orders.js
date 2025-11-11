import express from "express";
import requireUser from "#middleware/requireUser";
import getUserFromToken from "#middleware/getUserFromToken";
import { createOrder, deleteOrder, getOrders, getOrdersByUserId } from "#db/queries/orders";
import requireBody from "#middleware/requireBody";
import checkOrderExists from "#middleware/checkOrderExists";

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
})

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
})