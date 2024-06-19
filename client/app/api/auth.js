import client from "./client";

const login = (email, password) =>
  client.post("/auth/login", { email, password });

const updateUserInfo = async (
  _id,
  firstName,
  lastName,
  currentPassword,
  newPassword,
  /* reader_type = null,
  reader_goals = [],
  reader_genres = [] */
) => {
  try {
    const response = await client.put("/auth/update-user-info", {
      _id,
      firstName,
      lastName,
      currentPassword,
      newPassword,
      /* reader_type,
      reader_goals,
      reader_genres, */
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
  /* reader_type = null,
  reader_goals = [],
  reader_genres = [] */
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
  followUser,
};