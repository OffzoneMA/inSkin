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

const getBrandsByIds = async (ids) => {
  try {
      // Join the array of brand IDs into a comma-separated string
      const idsString = ids.join(',');

      // Make a GET request to the server endpoint with the brand IDs
      const response = await client.get(`brands/get-brands-byids?ids=${idsString}`);

      // Return the response data (brands)
      return response.data;
  } catch (error) {
      // Handle errors if the request fails
      console.error(error);
      throw new Error("Failed to fetch brands by IDs");
  }
};


export default {
    getAllBrands,
    getBrandById,
    getBrandById,
};