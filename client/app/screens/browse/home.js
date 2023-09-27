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

import productActionsApi from "../../api/product_actions";

import { useToast } from "react-native-toast-notifications";

function DiscoverHome({ navigation }) {
  //const [products, setProducts] = useState([]);

  const toast = useToast();

  const getAllProducts = async () => {
    const result = await productActionsApi.getAllProducts();
    console.log(result.data);
    if (!result.ok) {
      toast.show(result.data, {type: "danger"});
      return;
    }
    toast.show(result.data.message, {type: "success"});
  };


  return (
    <Page>
      <Heading>Browse</Heading>
      
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default DiscoverHome;
