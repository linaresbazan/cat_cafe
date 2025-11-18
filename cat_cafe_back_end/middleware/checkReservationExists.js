import { getReservationByReservationId } from "#db/queries/reservations";

export default async function checkReservationExists (req, res, next) {
    const { id } = req.params;

    const reservation = await getReservationByReservationId({ id });
    if (!reservation) req.reservation = undefined;
    else req.reservation = reservation;
    next();
}
