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

function ProductHome({ route }) {

  const theme = useTheme();

  const { product } = route.params;
  
  const mockComments = [
    {
      userId: "1",
      text: 'Nice',
      review: 5,
    },
    {
      userId: "2",
      text: 'Great product!',
      review: 4,
    },
    {
      userId: "3",
      text: 'Not bad',
      review: 3,
    },
    {
      userId: "4",
      text: 'Amazing!',
      review: 5,
    },
    {
      userId: "5",
      text: 'Could be better',
      review: 2,
    },
    {
      userId: "6",
      text: 'Impressive quality',
      review: 4,
    },
    {
      userId: "7",
      text: 'Decent',
      review: 3,
    },
    {
      userId: "8",
      text: 'Top-notch!',
      review: 5,
    },
    {
      userId: "9",
      text: 'Satisfactory',
      review: 3,
    },
    {
      userId: "10",
      text: 'Excellent service',
      review: 5,
    },
  ];
  

  const Item = ({ item }) => (
    <Pressable style={styles.item}>
      <View style={{ marginVertical: 20, flex: 1, flexDirection:"column"}}>
        <Text>{item.text}</Text>
        <Text>{item.review}</Text>
      </View>
    </Pressable>
  );

  const [rating, setRating] = useState(0);
  
  return (
    <Page>
      <Heading>{product.barcode}</Heading>
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
            <Text>{product.productDetails.name}</Text>
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
          keyExtractor={(item, index) => {return item.userId}}
        />
      </SafeAreaView>
    </Page>
  );
}

const styles = StyleSheet.create({
});

export default ProductHome;
