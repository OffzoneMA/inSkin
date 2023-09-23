import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList, // Import FlatList for displaying a list of items
} from "react-native";

import Page from "../../components/Page";
import Heading from "../../components/Heading";
import Button from "../../components/Button";

function DiscoverHome({ navigation }) {
  const [products, setProducts] = useState([]);

  // Fetch products from your server
  useEffect(() => {
    // Replace this with your API endpoint to fetch products from MongoDB
    fetch("YOUR_API_ENDPOINT")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <Page>
      <Heading>Browse</Heading>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id} // Use a unique identifier for each product
        renderItem={({ item }) => (
          <View>
            <Text>Name: {item.name}</Text>
            <Text>Ratings: {item.ratings}</Text>
            {/* You can display the product image here */}
          </View>
        )}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default DiscoverHome;
