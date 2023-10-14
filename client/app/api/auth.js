import client from "./client";

const login = (email, password) =>
  client.post("/auth/login", { email, password });

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
  formData.append("userId", userId); // Include userId in the FormData
  formData.append("image", image);

  
  return client.put("/auth/update-profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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

export default {
  login,
  register,
  checkUserStatus,
  updateProfileImage,
  getProfileImage,
  getUsersByIds,
};