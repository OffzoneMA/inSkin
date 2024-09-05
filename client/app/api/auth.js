import client from "./client";

//const login = (email, password) => client.post("/auth/login", { email, password });
const login = async (email, password) => {
  try {
    console.log("email",email)
    console.log("password", password)
    const response = await client.post("/auth/login", { email, password });
    console.log("Réponse du serveur:", response);
    return response; // Retourner les données de la réponse
  } catch (error) {
    // Gérer les erreurs ici
    console.error("Erreur lors de la requête:", error.response ? error.response.data : error.message);
    throw error; // Rejeter l'erreur pour traitement ultérieur
  }
};

const updateUserInfo = async (
  _id,
  firstName,
  lastName,
  currentPassword,
  newPassword,
) => {
  try {
    const response = await client.put("/auth/update-user-info", {
      _id,
      firstName,
      lastName,
      currentPassword,
      newPassword,
    });

    return response;
  } catch (error) {
    console.error("Error updating user information:", error); // Handle the error
    throw error; // Rethrow the error for the caller to handle
  }
};

const register = (
  firstName,
  lastName,
  email,
  password,
  
) =>

  client.post("/auth/register", {
    firstName,
    lastName,
    email,
    password,
    /* reader_type,
    reader_goals,
    reader_genres, */
  });


const checkUserStatus = () => client.get("/auth/status");
const updateProfileImage = (userId, image) => {
  const formData = new FormData();
  formData.append("_id", userId); // Include userId in the FormData
  formData.append("image", image);

  return client.put("/auth/update-profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
const comparePassword = async (userId, currentPassword) => {
  try {
    const response = await client.post("/auth/compare-password", {
      _id: userId,
      currentPassword
    });
    return response.data; // Retournez les données de la réponse si nécessaire
  } catch (error) {
    console.error("Error comparing password:", error);
    throw error;
  }
};

const getProfileImage = (userId) => {
  return client.get(`/auth/profile-image/${userId}`);
};
const getfavoriteproducts=()=>client.get("/auth/favorite-products")
const allfavoriteproducts=()=>client.get("/auth/allfavorite-products")

const favoriteproductsbycategory=(categoryName)=>client.get(`/auth/favorite-products-by-category/${categoryName}`)
const getCategories=()=>client.get("/auth/getCategories")
const addToFavorites = (userId, productId, category) => 
    client.post('/auth/favorites', {
      userId,
      productId,
      category
    });
const getFavorites = async (id) => {
  try {
    console.log("iddddd",id);
    const response = await client.get(`/auth/favorites/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch product by ID");
  }
};
const favoriteswithproductid = async(id)=>{
  try{
    const response= await client.get( `/auth/favoriteswithproductid/${id}`);
    return response.data;

  } catch(error){
    console.error(error);
    throw new Error("Failed to fetch product by ID");

  }
}
const removlistFavoris = async (userId, productId) => {
  try {
    const response = await client.delete(`/auth/removlistFavoris/${productId}`,{
      userId,
    });
    console.log("response",response);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch product by ID");
  }
};
const getUsersByIds = async (ids) => {
  try {
      // Join the array of brand IDs into a comma-separated string
      const idsString = ids.join(',');

      // Make a GET request to the server endpoint with the brand IDs
      const response = await client.get(`auth/get-users-byids?ids=${idsString}`);

      // Return the response data (brands)
      return response.data;
  } catch (error) {
      // Handle errors if the request fails
      console.error(error);
      throw new Error("Failed to fetch brands by IDs");
  }
};
const followUser = async (email) => {
  try {
    console.log("email",email )
    const response = await client.post("/auth/follow", { email: email });
    return response.data; // Retournez les données de la réponse si nécessaire
  } catch (error) {
    console.error("Error following user:", error);
    throw error; // Renvoyez l'erreur pour que l'appelant la gère
  }
};
const getUserByEmail = async (email) => {
  try {
    const response = await client.get(`/auth/get-users-by-emails?email=${email}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch user by email");
  }
};
const handleGoogleLogin = async () => {
  try {
    // Appeler la fonction d'authentification Google du module client
    const response = await client.get("/auth/google");
    // Gérer la réponse ou la redirection du serveur
    console.log("Google authentication initiated:");
  } catch (error) {
    console.error("Error initiating Google authentication:", error);
    // Gérer les erreurs, par exemple afficher un message à l'utilisateur
  }
};


const getRandomUsers = async () => {
  try {
    const response = await client.get("/auth/get-random-users");
    return response.data;
  } catch (error) {
    console.error("Error getting random users:", error);
    throw error;
  }
};



const searchUser = async (firstName, lastName, userName) => {
  try {
    // Construire l'URL avec les paramètres de recherche
    const params = new URLSearchParams();
    if (firstName) params.append('firstName', firstName);
    if (lastName) params.append('lastName', lastName);
    if (userName) params.append('userName', userName);

    const response = await client.get(`/auth/search-users?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error searching for users:", error);
    throw error;
  }
};



export default {
  login,
  register,
  checkUserStatus,
  updateProfileImage,
  getProfileImage,
  getUsersByIds,
  updateUserInfo,
  getUserByEmail,
  handleGoogleLogin,
  getRandomUsers,
  followUser,
  searchUser,
  addToFavorites,
  getRandomUsers,
  getFavorites,
  searchUser,
  removlistFavoris,
  favoriteswithproductid,
  getfavoriteproducts,
  getCategories,
  favoriteproductsbycategory,
  allfavoriteproducts

};