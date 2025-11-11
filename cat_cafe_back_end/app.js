import express from "express";
import userRouter from "#api/users";
import catRouter from "#api/cats";
import menuItemsRouter from "#api/menuItems";
import reservationTypesRouter from "#api/reservationTypes";
import orderRouter from "#api/orders";
// import productRouter from "#api/products";

const app = express();
export default app;

// ### Pre-routing middleware

// Parse JSON request bodies
app.use(express.json());

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// ### Routing middleware
// TODO - create routers
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the cat cafe!');
});
app.use('/users', userRouter);
app.use('/cats', catRouter);
app.use('/menu-items', menuItemsRouter);
app.use('/reservation-types', reservationTypesRouter);
app.use('/orders', orderRouter);
// app.use('/products', productRouter);

// ### Error-handling middleware
// Catch-all error-handling middleware
app.use((err, req, res, next) => {
  if (err.code === "22P02") return res.status(400).send("Invalid data type sent in request");
  if (err.code === "23503") return res.status(404).send("Record does not exist");
  if (err.code === "23505") return res.status(400).send("Record already exists");
  return res.status(500).send("Sorry! Something went wrong :(: ", err);
});