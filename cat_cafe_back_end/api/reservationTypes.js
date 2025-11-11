// TODO
import express from 'express';
import {
  addReservationType,
  deleteReservationType,
  getReservationTypes,
  updateReservationType
} from "#db/queries/reservationTypes";
import checkReservationTypeExists from "#middleware/checkReservationTypeExists";
import requireBody from "#middleware/requireBody";

const router = express.Router();
export default router;

/** returns all reservation_types */
router.get('/', async (req, res) => {
  const reservationTypes = await getReservationTypes();

  return res.status(200).send(reservationTypes);
});

/** returns a specific reservation_type */
router.get('/:id', checkReservationTypeExists, async (req, res) => {
  if (!req.reservationType) return res.status(404).send("Reservation_type Not Found");
  return res.status(200).send(req.reservationType);
});

/** Adds a reservation_type */
router.post('/', requireBody(["type", "description", "cost", "timeLength"]), async (req, res) => {
  const { type, description, cost, timeLength } = req.body;

  const reservationType = await addReservationType({ type, description, cost, timeLength });
  if (!reservationType) return res.status(400).send("Error adding reservation_type");
  return res.status(201).send(reservationType);
});

/** Updates a reservation_type */
router.put('/:id', requireBody(["type", "description", "cost", "timeLength"]), async (req, res) => {
  const { id } = req.params;

  if (id != parseInt(id) || id < 0) return res.status(400).send("The provided id is not a positive integer.");

  const { type, description, cost, timeLength } = req.body;

  const reservationType = await updateReservationType({ id, type, description, cost, timeLength });
  if (!reservationType) return res.status(404).send("Menu_item does not exist");

  return res.status(200).send(reservationType);
});

/** Deletes a reservation_type */
router.delete('/:id', checkReservationTypeExists, async (req, res) => {
  if (!req.reservationType) return res.status(404).send("Menu_item Not Found");
  const { id } = req.params;

  const reservationType = await deleteReservationType({ id });
  return res.status(200).send(reservationType);
});