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

import StarRating from 'react-native-star-rating';

function ProductHome({ navigation }) {

  const theme = useTheme();

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

  return (
    <Page>
      <Heading>9780004721156</Heading>
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
            <Text>Name : Naked Heat</Text>
            <Text>Brand : Urban Decay</Text>
            <View style={{ justifyContent: "center"}}>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={3.8}
              />
            </View>
          </View>
      </View>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={mockComments}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={(item) => item._id}
        />
      </SafeAreaView>
    </Page>
  );
}

const styles = StyleSheet.create({
});

export default ProductHome;
