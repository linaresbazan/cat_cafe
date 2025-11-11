import { getMenuItem } from "#db/queries/menuItems";

export default async function checkMenuItemExists (req, res, next) {
    const { id } = req.params;

    const menuItem = await getMenuItem({ id });
    if (!menuItem) req.menuItem = undefined;
    else req.menuItem = menuItem;
    next();
}
