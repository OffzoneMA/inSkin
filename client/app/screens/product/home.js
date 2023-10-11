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
import TextInput from "../../components/TextInput";

import { useTheme, Icon, Text } from "@ui-kitten/components";

import StarRating from 'react-native-star-rating-widget';

import { MaterialCommunityIcons } from "@expo/vector-icons";

function ProductHome({ route }) {

  const theme = useTheme();

  const { product } = route.params;
  
  const mockComments = [
    {
      userName: "user123",
      userId: "1",
      text: 'Nice',
      review: 5,
    },
    {
      userName: "user456",
      userId: "2",
      text: 'Great!',
      review: 4,
    },
    {
      userName: "user789",
      userId: "3",
      text: 'Awesome',
      review: 4.5,
    },
    {
      userName: "user010",
      userId: "4",
      text: 'Excellent',
      review: 5,
    },
    {
      userName: "user111",
      userId: "5",
      text: 'Fantastic',
      review: 4.8,
    },
    {
      userName: "user222",
      userId: "6",
      text: 'Wonderful',
      review: 4.2,
    },
    {
      userName: "user333",
      userId: "7",
      text: 'Impressive',
      review: 4.7,
    },
    {
      userName: "user444",
      userId: "8",
      text: 'Superb',
      review: 4.3,
    },
    {
      userName: "user555",
      userId: "9",
      text: 'Brilliant',
      review: 4.9,
    },
    {
      userName: "user666",
      userId: "10",
      text: 'Amazing',
      review: 4.6,
    }
  ];  

  const Item = ({ item }) => (
    <Pressable style={styles.item}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ marginTop: 10, flex: 1, flexDirection:"column"}}>
          <View style={{ flexDirection: "row", alignItems: "center"}}>
            <Text>{item.userName}</Text>
            <StarRating
              style={{marginLeft: 20}}
              rating={item.review}
              onChange={() => {}}
              animationConfig={{scale: 1}}
              starSize={20}
              starStyle={{marginHorizontal: 0}}
            />
          </View>
          
          <Text>{item.text}</Text>
          <Text>{item.review}</Text>
        </View>
        <View>
          <Icon
            name="heart-outline"
            width={24} // Set the width of the icon
            height={24} // Set the height of the icon
            fill={theme["color-basic-600"]} // Set the color of the icon
          />
        </View>
      </View>
    </Pressable>
  );

  const [rating, setRating] = useState(0);
  
  return (
    <Page>
      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
      <Heading>{product.barcode}</Heading>
      <View style={{flexDirection: "row"}}>
        <Icon
          name="share-outline"
          width={24} // Set the width of the icon
          height={24} // Set the height of the icon
          fill={theme["color-basic-600"]} // Set the color of the icon
        />
        <View style={{ marginRight: 10 }} />
        <Icon
          name="bookmark-outline"
          width={24} // Set the width of the icon
          height={24} // Set the height of the icon
          fill={theme["color-basic-600"]} // Set the color of the icon
        />
        </View>
      </View>
      
      <View style={{ flexDirection: "row" }}>
          <View style={{ width: 100, height: 100, borderRadius: 10, backgroundColor: "gray", justifyContent: 'center', alignItems: 'center' }}>
            <Icon
            name="image-outline"
            width={24} // Set the width of the icon
            height={24} // Set the height of the icon
            fill={theme["color-basic-600"]} // Set the color of the icon
            />
          </View>
          <View style={{ flex: 1, marginHorizontal: 5, flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 2, flexDirection: "column", alignItems: "center"}}>
              <Text>{product.productDetails.name}</Text>
              <Text>{product.productDetails.brands.join(', ')}</Text>
            </View>  
            <View style={{ flex: 1, flexDirection: "column", alignItems: "center"}}>
              <Text>{rating}</Text>
              <StarRating
                rating={rating}
                onChange={setRating}
                style={{marginLeft: 20}}
                animationConfig={{scale: 1}}
                starSize={20}
                starStyle={{marginHorizontal: 0}}
              />
            </View>
          </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flexDirection: "row", marginRight: 5 }}>
          <Icon
            name="eye-outline"
            width={24} // Set the width of the icon
            height={24} // Set the height of the icon
            fill={theme["color-basic-600"]} // Set the color of the icon
          />
          <Text>5450</Text>
        </View>
        <View style={{ flexDirection: "row", marginRight: 5 }}>
          <Icon
            name="share-outline"
            width={24} // Set the width of the icon
            height={24} // Set the height of the icon
            fill={theme["color-basic-600"]} // Set the color of the icon
          />
          <Text>5450</Text>
        </View>
        <View style={{ flexDirection: "row", marginRight: 5 }}>
          <Icon
            name="funnel-outline"
            width={24} // Set the width of the icon
            height={24} // Set the height of the icon
            fill={theme["color-basic-600"]} // Set the color of the icon
          />
          <Text>Filter</Text>
        </View>
        <View style={{ flexDirection: "row", marginLeft: 'auto' }}>
          <MaterialCommunityIcons
            name={"cube-scan"}
            size={24}
            color={theme["color-basic-600"]}
          />
          <Text>123</Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>
          <FlatList
            data={mockComments}
            renderItem={({ item }) => <Item item={item} />}
            keyExtractor={(item, index) => {return item.userId}}
          />
      </View>
      <View style={{ paddingTop: 10, flexDirection: "column", borderWidth: 1, borderColor: "black", borderRadius: 8, alignItems: "center" }}>
        <StarRating
          rating={rating}
          onChange={setRating}
          style={{marginLeft: 20}}
          animationConfig={{scale: 1}}
          starSize={35}
          starStyle={{marginHorizontal: 0}}
        />
        <View style={{ paddingHorizontal: 5, flexDirection: "row", alignItems: "center" }}>
          <View style={{flex: 1, marginTop: 10, marginHorizontal: 5}}>
            <TextInput
              placeholder="Comment..."
            />
          </View>
          
          <View style={{paddingHorizontal: 10}}>
            <MaterialCommunityIcons
              name={"send"}
              size={24}
              color={theme["color-basic-600"]}
            />
          </View>
          
        </View>
      </View>
      
    </Page>
  );
}

const styles = StyleSheet.create({
});

export default ProductHome;
