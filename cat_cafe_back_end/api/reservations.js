// TODO
import express from "express";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";
import {
  createReservation,
  deleteReservation,
  getReservations,
  getReservationsByUserId
} from "#db/queries/reservations";
import requireBody from "#middleware/requireBody";
import checkReservationExists from "#middleware/checkReservationExists";

const router = express.Router();
export default router;

/**
 * Returns all reservations for a specific user
 * Returns all reservations if admin
 */
router.get('/', getUserFromToken, requireUser, async (req, res) => {
  const user = req.user;
  const { is_admin: isAdmin } = user;
  let orders;
  if (isAdmin) orders = await getReservations();
  else orders = await getReservationsByUserId({ userId: user.id });

  return res.status(200).send(orders);
});

/** creates a reservation */
router.post("/", getUserFromToken, requireUser, requireBody([ "reservationTypeId", "startTime" ]), async (req, res) => {
  const { reservationTypeId, startTime } = req.body;

  const user = req.user;

  const reservation = await createReservation({userId: user.id, reservationTypeId, startTime});

  if (!reservation) return res.status(400).send("Could not create reservation");
  return res.status(201).send(reservation);
});

/** Deletes a reservation */
router.delete('/:id', getUserFromToken, requireUser, checkReservationExists, async (req, res) => {
  if (!req.reservation) return res.status(404).send("Reservation not found");
  const { id } = req.params;
  const user = req.user;
  const { is_admin: isAdmin } = user;

  if (!isAdmin) return res.status(403).send("Action not allowed");

  const reservation = await deleteReservation({ id });
  return res.status(200).send(reservation);
});