import client from "./client";

// GET all products
const getAllBrands = async () => client.get("/brands");

const getBrandById = async (id) => {
    try {
      const response = await client.get(`/brands/get-brand-byid/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch brand by ID");
    }
  };

export default {
    getAllBrands,
    getBrandById,
    getBrandById,
};