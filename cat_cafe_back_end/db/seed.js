import db from "#db/client";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // TODO - fill in seed function
  // Create admin user
  await createUser({ username: "admin", password: "admin", email: "admin@gmail.com", firstName: "admin", lastName: "admin", isAdmin: true });
}
