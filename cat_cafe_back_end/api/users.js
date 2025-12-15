// TODO
import express from "express";
import { createToken } from "#utils/jwt";
import requireBody from "#middleware/requireBody";
import { createUser, deleteUser, getUser, getUserById, updateUser } from "#db/queries/users";
import bcrypt from "bcrypt";

const router = express.Router();
export default router;

/** Registers a new user and returns a token */
router.post("/register", requireBody(["username", "password", "firstName", "lastName", "phone", "email"]), async (req, res) => {
  const { username, password, firstName, lastName, phone, email } = req.body;

  const user = await createUser({ username, password, firstName, lastName, phone, email });

  const token = createToken(user);

  return res.status(201).send(token);
});

/** Logs in a user and returns a token */
router.post("/login", requireBody(["username", "password"]), async (req, res) => {
  const { username, password } = req.body;
  const user = await getUser({ username });
  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) return res.status(401).send("Wrong username or password");

  const token = createToken(user);

  return res.status(200).send(token);
});

/** Returns a user with the provided id*/
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (id != parseInt(id) || id < 0) return res.status(400).send("The provided id is not a positive integer.");

  const user = await getUserById(id);
  if (!user) return res.status(404).send("User does not exist");

  return res.status(200).send(user);
});

/** Updates a user */
router.put('/:id', requireBody(["password", "firstName", "lastName", "email"]), async (req, res) => {
  const { id } = req.params;

  if (id != parseInt(id) || id < 0) return res.status(400).send("The provided id is not a positive integer.");

  const { password, firstName, lastName, email } = req.body;

  const user = await updateUser({ id, password, firstName, lastName, email});
  if (!user) return res.status(404).send("User does not exist");

  return res.status(200).send(user);
});

/** Deletes a user */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (id != parseInt(id) || id < 0) return res.status(400).send("The provided id is not a positive integer.");

  const user = await deleteUser(id);
  if (!user) return res.status(404).send("User does not exist");

  return res.status(204).send("");
});


