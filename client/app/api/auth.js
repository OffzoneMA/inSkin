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
  return client.get(`/auth/profile-image/6517645e1776a81824a64e4a`);
};

export default {
  login,
  register,
  checkUserStatus,
  updateProfileImage,
  getProfileImage
};