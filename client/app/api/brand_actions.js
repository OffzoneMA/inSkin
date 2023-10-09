import client from "./client";

// GET all products
const getAllBrands = async () => client.get("/brands");

export default {
    getAllBrands,
};