import client from "./client";

const add_product = (
  barcode,
  userId,
  //images,
  name,
  brands,
  categories,
  ingredients,
  /* reader_type = null,
  reader_goals = [],
  reader_genres = [] */
) => {
  console.log(brands);
  const formData = new FormData();
  formData.append("barcode", barcode);
  formData.append("userId", userId); // Include userId in the FormData
  //formData.append("images", images);
  formData.append("productDetails[name]", name);
  brands.forEach((item) => formData.append("productDetails[brands][]", item));
  categories.forEach((item) => formData.append("productDetails[categories][]", categories));
  ingredients.forEach((item) => formData.append("productDetails[ingredients][]", ingredients));

  return client.post("/products/add-product", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
  

// GET all products
const getAllProducts = () => client.get("/products");

// GET a single product by ID
const getProductById = async (id) => {
  try {
    const response = await client.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch product by ID");
  }
};

export default {
    add_product,
    getAllProducts,
};