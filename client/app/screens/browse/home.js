import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  FlatList,
  StatusBar,
  RefreshControl,
} from "react-native";

import Page from "../../components/Page";
import Heading from "../../components/Heading";
import Button from "../../components/Button";

import productActionsApi from "../../api/product_actions";

import { useToast } from "react-native-toast-notifications";

import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation

function DiscoverHome({ navigation }) {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getAllProducts = async () => {
    try {
      const result = await productActionsApi.getAllProducts();
      if (!result.ok) {
        toast.show(result.data, { type: "danger" });
      } else {
        toast.show(result.data.message, { type: "success" });
        setProducts(result.data.products);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsRefreshing(false); // Set refreshing state to false after data fetch is completed
    }
  };

  // Fetch products when the component mounts and when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setIsRefreshing(true); // Set refreshing state to true when the screen comes into focus
      getAllProducts();
    }, [])
  );

  const onRefresh = () => {
    setIsRefreshing(true); // Set refreshing state to true when the user pulls down to refresh
    getAllProducts();
  };

  const Item = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.barcode}</Text>
    </View>
  );

  return (
    <Page>
      <Heading>Browse</Heading>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={products}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
            />
          }
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
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default DiscoverHome;
