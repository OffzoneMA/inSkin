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
  TouchableOpacity,
} from "react-native";

import Page from "../../components/Page";
import Heading from "../../components/Heading";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import TextLink from "../../components/TextLink";
import Label from "../../components/Label";
import Caption from "../../components/Caption";
import SubHeading from "../../components/SubHeading";
import Paragraph from "../../components/Paragraph";

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

  const [ scannedProduct, setScannedProduct ] = useState(null);

  const getAllProducts = async () => {
    try {
      const result = await productActionsApi.getAllComments();
      
      if (!result.ok) {
        //toast.show(result.data, { type: "danger" });
      } else {
        //toast.show(result.data.message, { type: "success" });
        setComments(result.data);
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

  const getProductById = async (_id) => {
    try {
      const result = await productActionsApi.getProductById(_id);
      
      // Handle the case when result is ok
      setScannedProduct(result);
      navigation.navigate('Product', { product: result });
  
    } catch (error) {
      console.error("Error getting product data: ", error);
    }
  }
  
  const Item = ({ item }) => (
    <TouchableOpacity activeOpacity={0.7} style={styles.item} onPress={() => 
      { 
        getProductById(item.productId);
      }}
    >
      <View style={{ borderRadius: 5, flex: 1/4, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{width: '100%', borderRadius: 100, marginBottom: "auto", backgroundColor: "gray", aspectRatio: 1}}>

        </View>
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

        <Label style={{marginLeft: 4}}>{item.userName}</Label>
        <SubHeading style={{marginLeft: 4}}>{item.productName}</SubHeading>
        <StarRating
          rating={item.review}
          onChange={() => {}}
          animationConfig={{scale: 1}}
          starSize={20}
          starStyle={{marginHorizontal: 0}}
        />
        {item.text !== "" ? <Paragraph style={{marginLeft: 4}}>{item.text}</Paragraph> : null}
        
      </View>
    </TouchableOpacity>
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
    padding: 8,
    marginVertical: 3,
    borderRadius: 5,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 100,
    margin: 5,
  },
  title: {
    fontSize: 32,
  },
});

export default DiscoverHome;
