import client from "./client";

const add_product = (
  barcode,
  userId,
  images,
  name,
  brand,
  description,
  /* reader_type = null,
  reader_goals = [],
  reader_genres = [] */
) => {
  
  const formData = new FormData();
  
  formData.append("barcode", barcode);
  formData.append("userId", userId); // Include userId in the FormData
  // Iterate over the images array and append each image object to the FormData
  images.forEach((item) => formData.append("images", item));
  formData.append("productDetails[name]", name);
  formData.append("productDetails[brand]", brand);
  formData.append("productDetails[description]", description);

  return client.post("/products/add-product", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
  

// GET all products
<<<<<<< HEAD
const getAllProducts = () => client.get("/products");

=======
const getAllProducts = () => client.get("/products/users-with-products");
const getmyproduct = () => client.get("/products/my-products");
const getfollowedproducts=()=>client.get("/products/followed-products")
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
// GET a single product by ID
const getProductById = async (id) => {
  try {
    const response = await client.get(`/products/get-product-byid/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch product by ID");
  }
};

const getProductByBarcode = async (barcode) => {
  try {
    const response = await client.get(`/products/get-product-bybarcode/${barcode}`);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch product by barcode");
  }
}

const addCommentToProduct = async (productId, userId, text, review) => {
  try {
    // Prepare the request body with necessary data
    const requestBody = {
      _id: productId,
      userId: userId,
      text: text,
      review: review,
    };

    // Make a PUT request to the server endpoint to add a comment
    const response = await client.put(`/products/add-comment`, requestBody);

    // Handle the response status as needed
    if (response.status === 200) {
      return "Comment added successfully"; // Successfully added comment
    } else {
      throw new Error("Failed to add comment to product"); // Handle other status codes if necessary
    }
  } catch (error) {
    // Handle errors if the request fails
    console.error(error);
    throw new Error("Failed to add comment to product");
  }
};

const getProductComments = async (_id) => {
  try {
    const response = await client.get(`/products/product-comments/${_id}`);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch product by barcode");
  }
}

// GET all products
const getAllComments = () => client.get("/products/all-comments");

export default {
    add_product,
    getAllProducts,
    getProductById,
    getProductByBarcode,
    addCommentToProduct,
    getProductComments,
    getAllComments,
<<<<<<< HEAD
=======
    getfollowedproducts,
    getmyproduct,
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
};