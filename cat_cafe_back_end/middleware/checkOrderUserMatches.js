export default async function checkOrderUserMatches (req, res, next) {
    const { id } = req.user;
    const { user_id } = req.order;

  if (id !== user_id) return res.status(403).send("Logged-in user is not the user who made the order");
  next();
}
