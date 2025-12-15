import db from "#db/client";
import { createUser } from "#db/queries/users";
import { addCat } from "#db/queries/cats";
import { addMenuItem } from "#db/queries/menuItems";
import { addReservationType } from "#db/queries/reservationTypes";
import { addMenuItemsToOrder, createOrder } from "#db/queries/orders";
import menuItems from "#api/menuItems";
import cats from "#db/data";
import { addMenuItemType } from "#db/queries/menuItemTypes";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // TODO - fill in seed function
  // Create admin user
  await createUser({ username: "admin", password: "admin", phone: "888-555-1234", email: "admin@gmail.com", firstName: "admin", lastName: "admin", isAdmin: true });

  // Create regular users
  const user2 = await createUser({ username: "user2", password: "user2", phone: "888-555-2345", email: "user2@gmail.com", firstName: "User 2", lastName: "User2", isAdmin: false });
  const user3 = await createUser({ username: "user3", password: "user3", phone: "888-555-3456", email: "user3@gmail.com", firstName: "User 3", lastName: "User3", isAdmin: false });

  // Create Cats
  for (let i = 0; i < cats.length; ++i) {
    await addCat(cats[i]);
  }

  // Create Menu Item Types
  const menuItemTypeCoffee = await addMenuItemType({ menuItemType: "coffee" });
  const menuItemTypeBakery = await addMenuItemType({ menuItemType: "bakery" });
  console.log(menuItemTypeBakery);
  // Create Menu Item
  const menuItem = await addMenuItem({ name: "Glazed Donut", description: "Yummy donut", unitPrice: 2, type_id: menuItemTypeBakery.id });

  // Create Reservation Types
  await addReservationType({ type: "60-Minute Kitten Session", description: "60 Minute Kitten Session", cost: 15, timeLength: 60 });
  await addReservationType({ type: "60-Minute Adult Cat Session", description: "60 Minute Adult Cat Session", cost: 15, timeLength: 60 });

  // Add order to User2
  const user2Order = await createOrder({ userId: user2.id, date: new Date() });
  // Add order to User3
  const user3Order = await createOrder({ userId: user3.id, date: new Date() });

  // Add item to User2's Order
  await addMenuItemsToOrder({ orderId: user2Order.id, menuItemId: menuItem.id, quantity: 2 });
  // Add item to User3's Order
  await addMenuItemsToOrder({ orderId: user3Order.id, menuItemId: menuItem.id, quantity: 1 });

}
