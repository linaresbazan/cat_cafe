// TODO
import express from "express";
import { addCat, getCats, removeCat, updateCat } from "#db/queries/cats";
import checkCatExists from "#middleware/checkCatExists";
import requireBody from "#middleware/requireBody";

const router = express.Router();
export default router;

/** returns all cats */
router.get('/', async (req, res) => {
  const cats = await getCats();

  return res.status(200).send(cats);
});

/** returns a specific cat */
router.get('/:id', checkCatExists, async (req, res) => {
  if (!req.cat) return res.status(404).send("Cat Not Found");
  return res.status(200).send(req.cat);
});

/** Adds a cat */
router.post('/', requireBody(["name", "age", "sex", "breed", "description"]), async (req, res) => {
  const { name, age, sex, breed, description } = req.body;

  const cat = await addCat({ name, age, sex, breed, description });
  if (!cat) return res.status(400).send("Error adding cat");
  return res.status(201).send(cat);
});

/** Updates a cat */
router.put('/:id', requireBody(["name", "age", "sex", "breed", "description"]), async (req, res) => {
  const { id } = req.params;

  if (id != parseInt(id) || id < 0) return res.status(400).send("The provided id is not a positive integer.");

  const { name, age, sex, breed, description } = req.body;

  const cat = await updateCat({ id, name, age, sex, breed, description });
  if (!cat) return res.status(404).send("Cat does not exist");

  return res.status(200).send(cat);
});

router.delete('/:id', checkCatExists, async (req, res) => {
  if (!req.cat) return res.status(404).send("Cat Not Found");
  const { id } = req.params;

  const cat = await removeCat({ id });
  return res.status(200).send(cat);
});