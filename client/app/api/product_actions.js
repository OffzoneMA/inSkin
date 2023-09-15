import client from "./client";

const add_product = (
  barcode,
  userId,
  name,
  brands,
  categories,
  ingredients,
  /* reader_type = null,
  reader_goals = [],
  reader_genres = [] */
) =>
  client.post("/products/add-product", {
    barcode,
    userId,
    name,
    brands,
    categories,
    ingredients,
    /* reader_type,
    reader_goals,
    reader_genres, */
  });

export default {
    add_product,
};