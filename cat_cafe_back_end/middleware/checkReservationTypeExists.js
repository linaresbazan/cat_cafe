import { getReservationType } from "#db/queries/reservationTypes";

export default async function checkReservationTypeExists (req, res, next) {
    const { id } = req.params;

    const reservationType = await getReservationType({ id });
    if (!reservationType) req.reservationType = undefined;
    else req.reservationType = reservationType;
    next();
}
