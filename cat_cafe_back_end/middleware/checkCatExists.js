import { getCat } from "#db/queries/cats";

export default async function checkCatExists (req, res, next) {
    const { id } = req.params;

    const cat = await getCat({ id });
    if (!cat) req.cat = undefined;
    else req.cat = cat;
    next();
}
