import client from "./client";

const add_product = (
  barcode,
  /* reader_type = null,
  reader_goals = [],
  reader_genres = [] */
) =>
  client.post("/products/add-product", {
    barcode,
    /* reader_type,
    reader_goals,
    reader_genres, */
  });

export default {
    add_product,
};