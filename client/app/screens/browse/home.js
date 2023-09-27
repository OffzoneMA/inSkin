import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  FlatList,
  StatusBar,
} from "react-native";

import Page from "../../components/Page";
import Heading from "../../components/Heading";
import Button from "../../components/Button";

import productActionsApi from "../../api/product_actions";

import { useToast } from "react-native-toast-notifications";

function DiscoverHome({ navigation }) {
  const toast = useToast();
  const [products, setProducts] = useState([]); // State to store the products

  // Function to fetch all products and update the state
  const getAllProducts = async () => {
    const result = await productActionsApi.getAllProducts();
    if (!result.ok) {
      toast.show(result.data, { type: "danger" });
    } else {
      toast.show(result.data.message, { type: "success" });
      setProducts(result.data.products); // Set the products in the state
    }
  };

  // Fetch products when the component mounts
  useEffect(() => {
    getAllProducts();
  }, []); // Empty dependency array to run this effect once on mount

  // Render each product item
  const Item = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.barcode}</Text>
      {/* Add more information about the product as needed */}
    </View>
  );

  // Inside the DiscoverHome component
return (
  <Page>
    <Heading>Browse</Heading>
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        renderItem={({item}) => <Item item={item} />}
        keyExtractor={item => item._id}
      />
    </SafeAreaView>
  </Page>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default DiscoverHome;
