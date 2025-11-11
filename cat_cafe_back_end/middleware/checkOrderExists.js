import { getOrderByOrderId } from "#db/queries/orders";

export default async function checkOrderExists (req, res, next) {
    const { id } = req.params;

    const order = await getOrderByOrderId({ id });
    if (!order) req.order = undefined;
    else req.order = order;
    next();
}
