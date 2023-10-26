import React, { useState, useContext } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
  TouchableOpacity,
  Image,
} from "react-native";

import Page from "../../components/Page";
import Heading from "../../components/Heading";
import TextInput from "../../components/TextInput";
import Label from "../../components/Label";
import SubHeading from "../../components/SubHeading";
import Paragraph from "../../components/Paragraph";

import { useTheme, Icon } from "@ui-kitten/components";

import StarRating from 'react-native-star-rating-widget';

import { MaterialCommunityIcons } from "@expo/vector-icons";

import productActionsApi from "../../api/product_actions";

import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation

import brandActionsApi from "../../api/brand_actions";

import authApi from "../../api/auth";

import AuthContext from "../../contexts/auth";

function ProductHome({ route }) {

  const theme = useTheme();

  const { product } = route.params;

  const [productRating, setProductRating] = useState(0);

  const [comments, setComments] = useState([]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const { user } = useContext(AuthContext);

  const [commentText, setCommentText] = useState("");

  const [commentRating, setCommentRating] = useState(0);

  const [brand, setBrand] = useState(null);

  function calculateProductRating(comments) {
    if (!comments || comments.length === 0) {
        return 0; // Default average rating if there are no comments or comments is empty
    }

    const totalRating = comments.reduce((accumulator, comment) => {
        return accumulator + comment.review;
    }, 0);

    const averageRating = totalRating / comments.length;
    setProductRating(averageRating.toFixed(1)); // Return average rating with 2 decimal places
  }


  const getProductComments = async () => {
    try {
      const result = await productActionsApi.getProductComments(product._id);

      if (!result.ok) {
        //toast.show(result.data, { type: "danger" });
      } else {
        //toast.show(result.data.message, { type: "success" });

        // Extract user IDs from comments
        const userIds = result.data.map(comment => comment.userId);
        
        const usernamesIds = await authApi.getUsersByIds(userIds);

        // Create a list of comments with usernames
        const comments = result.data.map(comment => {
          const user = usernamesIds.find(u => u._id === comment.userId);
          return {
              ...comment,
              userName: user ? user.userName : 'Unknown User' // Handle the case if user is not found
          };
        });
        calculateProductRating(comments);
        setComments(comments);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsRefreshing(false); // Set refreshing state to false after data fetch is completed
    }
  };

  const getBrandById = async (_id) => {
    try {
      const result = await brandActionsApi.getBrandById(_id);

      setBrand(result);

      if (!result.ok) {
        //toast.show(result.data, { type: "danger" });
      } else {
        //toast.show(result.data.message, { type: "success" });
        /* const brandName = result.data.brands.map(brand => ({
          value: brand._id, // Use _id as the key
          label: brand.name // Use name as the value
        })); */
        //const brandName = result.data.brand;
        //setBrandsNames(brandsNames);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };



  const addCommentToProduct = async () => {
    try {

      if(commentText == "" && commentRating == 0) {
        console.log("Comment is empty !")
        return;
      }

      const result = await productActionsApi
      .addCommentToProduct(
        product._id,
        user._id,
        commentText,
        commentRating
      );
      

      setCommentRating(0);
      setCommentText("");

      //console.log(result);
      if (!result.ok) {
        //toast.show(result.data, { type: "danger" });
      } else {
        //toast.show(result.data.message, { type: "success" });
        /* const brandName = result.data.brands.map(brand => ({
          value: brand._id, // Use _id as the key
          label: brand.name // Use name as the value
        })); */
        //const brandName = result.data.brand;
        //setBrandsNames(brandsNames);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const Item = ({ item }) => (
      <View style={{ marginVertical: 5, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
        <View style={{ flex: 1, flexDirection:"column" }}>
          <Label>{item.userName}</Label>
          <StarRating
            rating={item.review}
            onChange={() => {}}
            animationConfig={{scale: 1}}
            starSize={18}
            starStyle={{marginHorizontal: 0}}
          />
          {item.text !== "" ? <Paragraph style={{marginLeft: 4}}>{item.text}</Paragraph> : null}
        </View>
        <View style={{ padding: 5 }}>
          <TouchableOpacity
              onPress={()=>{
              }}
              style={{ borderRadius: 5}}
              activeOpacity={0.5} // Customize the opacity when pressed
            >
            <Icon
              name="heart-outline"
              width={20} // Set the width of the icon
              height={20} // Set the height of the icon
              fill={theme["color-basic-600"]} // Set the color of the icon
            />
          </TouchableOpacity>
        </View>
        
      </View>
  );

  // Fetch products when the component mounts and when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setIsRefreshing(true); // Set refreshing state to true when the screen comes into focus
      getProductComments();
      getBrandById(product.productDetails.brand);
    }, [])
  );

  const onRefresh = () => {
    setIsRefreshing(true); // Set refreshing state to true when the user pulls down to refresh
    getProductComments();
  };
  
  return (
    <Page>
      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
      <Heading>{product.barcode}</Heading>
      <View style={{flexDirection: "row"}}>
        <TouchableOpacity
            onPress={()=>{
            }}
            style={{ borderRadius: 5}}
            activeOpacity={0.5} // Customize the opacity when pressed
          >
          <Icon
            name="share-outline"
            width={24} // Set the width of the icon
            height={24} // Set the height of the icon
            fill={theme["color-basic-600"]} // Set the color of the icon
          />
        </TouchableOpacity>

        
        <View style={{ marginRight: 10 }} />
        <TouchableOpacity
            onPress={()=>{
            }}
            style={{ borderRadius: 5}}
            activeOpacity={0.5} // Customize the opacity when pressed
          >
          <Icon
            name="bookmark-outline"
            width={24} // Set the width of the icon
            height={24} // Set the height of the icon
            fill={theme["color-basic-600"]} // Set the color of the icon
          />
        </TouchableOpacity>
        
        </View>
      </View>
      
      <View style={{ flexDirection: "row" }}>
        <View style={{ height: 100, width: 100 }}>
          <View style={{ flex: 1, borderRadius: 5, overflow: "hidden", backgroundColor: "blue" }}>
            <Image source={require('./1.png')} style={{flex: 1, width: null, height: null}} />
          </View>
        </View>
        
        <View style={{ flex: 1, marginBottom: "auto", flexDirection: "row", marginLeft: 5 }}>
          <View style={{ flex: 2, flexDirection: "column"}}>
            <SubHeading>{product.productDetails.name}</SubHeading>
            <Paragraph>
              {brand
                ? brand.name
                : 'No brand available'}
            </Paragraph>
          </View>  
          <View style={{ flexDirection: "column", justifyContent: "center"}}>
            <Paragraph style={{alignSelf: "center"}}>{productRating}</Paragraph>
            <StarRating
              rating={productRating}
              onChange={() => {}}
              animationConfig={{scale: 1}}
              starSize={20}
              starStyle={{marginHorizontal: 0}}
            />
          </View>
        </View>
      </View>
      <View style={{ marginVertical: 5, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity activeOpacity={0.5} onPress={()=>{}} style={{ borderRadius: 5, flexDirection: "row", marginRight: 5 }}>
          <Icon
            name="eye-outline"
            width={24} // Set the width of the icon
            height={24} // Set the height of the icon
            fill={theme["color-basic-600"]} // Set the color of the icon
          />
          <Paragraph>5450</Paragraph>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={()=>{}} style={{ borderRadius: 5, flexDirection: "row", marginRight: 5 }}>
          <Icon
            name="share-outline"
            width={24} // Set the width of the icon
            height={24} // Set the height of the icon
            fill={theme["color-basic-600"]} // Set the color of the icon
          />
          <Paragraph>5450</Paragraph>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={()=>{}} style={{ borderRadius: 5, flexDirection: "row", marginRight: 5 }}>
          <Icon
            name="funnel-outline"
            width={24} // Set the width of the icon
            height={24} // Set the height of the icon
            fill={theme["color-basic-600"]} // Set the color of the icon
          />
          <Paragraph>Filter</Paragraph>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} onPress={()=>{}} style={{ borderRadius: 5, flexDirection: "row", marginLeft: 'auto' }}>
          <MaterialCommunityIcons
            name={"cube-scan"}
            size={24}
            color={theme["color-basic-600"]}
          />
          <Paragraph>5450</Paragraph>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
          <FlatList
            data={comments}
            renderItem={({ item }) => <Item item={item} />}
            keyExtractor={(item, index) => {return item._id}}
            refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
            />
          }
          />
      </View>
      <View style={[styles.commentContainer, { paddingTop: 10, flexDirection: "column", alignItems: "center" }]}>
        <StarRating
          rating={commentRating}
          onChange={setCommentRating}
          style={{marginLeft: 20}}
          animationConfig={{scale: 1}}
          starSize={35}
          starStyle={{marginHorizontal: 0}}
        />
        <View style={{ paddingHorizontal: 5, flexDirection: "row", alignItems: "center" }}>
          <View style={{flex: 1, marginTop: 10, marginHorizontal: 10}}>
            <TextInput
              placeholder="Comment..."
              keyboardType="default"
              returnKeyType="next"
              autoCapitalize="none"
              value={commentText}
              onChangeText={setCommentText}
            />
          </View>
          
          <TouchableOpacity
            onPress={()=>{
              addCommentToProduct();
            }} 
            style={styles.button}
            activeOpacity={0.7} // Customize the opacity when pressed
          >
            <MaterialCommunityIcons
              name={"send"}
              size={24}
              color={theme["color-basic-600"]}
            />
          </TouchableOpacity>
          
        </View>
      </View>
      
    </Page>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'lightgray', // Customize the background color
    borderRadius: 5, // Optional: Customize the border radius
    alignSelf: 'stretch',
  },
  text: {
    fontSize: 16,
    color: 'black', // Customize the text color
  },
  commentContainer: {
    borderColor: "red",
    borderRadius: 5,
    marginBottom: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});

export default ProductHome;
