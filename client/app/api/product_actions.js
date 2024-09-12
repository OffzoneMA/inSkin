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
  console.log("userid", userId)
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
const getAllProducts = () => client.get("/products/users-with-products");
const getmyproduct = () => client.get("/products/my-products");
const getmyproductcount= () => client.get("/products/my-products/count");
const getfollowedproducts=()=>client.get("/products/followed-products")
const getfavoriteproducts=()=>client.get("/products/favorite-products")
const getnotifications=()=>client.get("/products/notifications");
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
const addlikeToProduct = async (productId, userId, like) => {
  try {
    // Préparer le corps de la requête avec les données nécessaires
    const requestBody = {
      _id: productId,
      userId: userId,
      like: like, // Valeur du like (1 pour like, -1 pour dislike)
    };

    console.log(" requestBody", requestBody)
    const response = await client.put(`/products/add-like`, requestBody);
    console.log("response de requestBody", response);
    // Vérification du statut de la réponse
    if (response.status === 200) {
      return response.data; // Retourner la réponse si le like a été ajouté avec succès
    } else {
      throw new Error("Échec de l'ajout du like au produit"); // Gérer les autres codes de statut
    }
  } catch (error) {
    // Gérer les erreurs si la requête échoue
    console.error("Erreur lors de l'ajout du like :", error);
    throw new Error("Échec de l'ajout du like au produit");
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
    getfollowedproducts,
    getmyproduct,
    getfavoriteproducts,
    addlikeToProduct,
    getnotifications,
    getmyproductcount
};