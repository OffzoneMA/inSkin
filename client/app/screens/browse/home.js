import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  FlatList,
  StatusBar,
  RefreshControl,
  Pressable,
  Image,
} from "react-native";

import Page from "../../components/Page";
import Heading from "../../components/Heading";
import Button from "../../components/Button";

import productActionsApi from "../../api/product_actions";

//import { useToast } from "react-native-toast-notifications";

import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation

import { useTheme, Icon } from "@ui-kitten/components";

import ShowProductModal from '../../components/ShowProductModal';

import StarRating from 'react-native-star-rating-widget';

function DiscoverHome({ navigation }) {
  //const toast = useToast();
  const [comments, setComments] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const theme = useTheme();

  const [showCustomPopup, setShowCustomPopup] = useState(false); // State to control custom pop-up visibility

  const getAllProducts = async () => {
    try {
      const result = await productActionsApi.getAllComments();
      
      if (!result.ok) {
        //toast.show(result.data, { type: "danger" });
      } else {
        //toast.show(result.data.message, { type: "success" });
        setComments(result.data);
        console.log(comments);
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

  const closeCustomPopup = () => {
    setShowCustomPopup(false);
  };

  const Item = ({ item }) => (
    <Pressable style={styles.item} onPress={() => { setShowCustomPopup(true) }}>
      <View style={{ backgroundColor: "gray", flex: 1/2, justifyContent: 'center', alignItems: 'center' }}>
      
      {/* {item.images.length > 0 ? (
        <Image 
          source={{ uri: item.images[0].imageUrl }} // Use the correct property for the image URL
          style={[styles.profilePicture, {  flex: 1 }]}
        />
      ) : (
        <Icon
          name="image-outline"
          width={24} // Set the width of the icon
          height={24} // Set the height of the icon
          fill={theme["color-basic-600"]} // Set the color of the icon
        />
      )} */}

        
      </View>
      <View style={{ flex: 1, flexDirection:"column"}}>
        <Text>{item.userName}</Text>
        <Text>{item.productName}</Text>
        <Text>{item.text}</Text>
        <StarRating
              style={{marginLeft: 20}}
              rating={item.review}
              onChange={() => {}}
              animationConfig={{scale: 1}}
              starSize={20}
              starStyle={{marginHorizontal: 0}}
            />
      </View>
      <View style={{ flex: 1/10, flexDirection:"column", justifyContent: "space-between"}}>
        <Icon
          name="share-outline"
          width={24} // Set the width of the icon
          height={24} // Set the height of the icon
          fill={theme["color-basic-600"]} // Set the color of the icon
        />
        <Icon
          name="bookmark-outline"
          width={24} // Set the width of the icon
          height={24} // Set the height of the icon
          fill={theme["color-basic-600"]} // Set the color of the icon
        />
      </View>
    </Pressable>
  );

  return (
    <Page>
      <Heading>Browse</Heading>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={comments}
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
      <ShowProductModal
        showCustomPopup={showCustomPopup}
        setShowCustomPopup={setShowCustomPopup}
        closeCustomPopup={closeCustomPopup}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 3,
    marginVertical: 2,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 100,
  },
  title: {
    fontSize: 32,
  },
});

export default DiscoverHome;
