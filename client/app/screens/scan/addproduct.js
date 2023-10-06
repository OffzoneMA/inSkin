import React, { useState, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Pressable,
} from "react-native";

import Page from "../../components/Page";
import Heading from "../../components/Heading";

import { useTheme, Icon, Text } from "@ui-kitten/components";


import StarRating from 'react-native-star-rating-widget';

function AddProduct({ route }) {

  const theme = useTheme();

  const { barcode } = route.params;
  
  const mockComments = [
    {
      id: 1,
      name: 'Item 1',
      barcode: '123456789',
    },
    {
      id: 2,
      name: 'Item 2',
      barcode: '987654321',
    },
    {
      id: 3,
      name: 'Item 3',
      barcode: '234567890',
    },
  ];

  const Item = ({ item }) => (
    <Pressable style={styles.item}>
      <View style={{ flex: 1, flexDirection:"column"}}>
        <Text>{item.name}</Text>
        <Text>{item.barcode}</Text>
      </View>
    </Pressable>
  );

  const [rating, setRating] = useState(0);
  
  return (
    <Page>
      <Heading>{barcode}</Heading>
      <View style={{ flexDirection: "row" }}>
          <View style={{ width: 100, height: 100, borderRadius: 10, backgroundColor: "gray", justifyContent: 'center', alignItems: 'center' }}>
            <Icon
            name="image-outline"
            width={24} // Set the width of the icon
            height={24} // Set the height of the icon
            fill={theme["color-basic-600"]} // Set the color of the icon
            />
          </View>
          <View style={{ marginLeft: 10, flexDirection: "column", justifyContent: 'center', alignItems: 'center' }}>
            {/* <Text>{product.productDetails.name}</Text>
            <Text>{product.productDetails.brands.join(', ')}</Text> */}
            <View style={{ justifyContent: "center"}}>
              <StarRating
                rating={rating}
                onChange={setRating}
              />
            </View>
          </View>
      </View>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={mockComments}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={(item, index) => {return item.id}}
        />
      </SafeAreaView>
    </Page>
  );
}

const styles = StyleSheet.create({
});

export default AddProduct;
