import React, { useState, useContext, useEffect } from "react";
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

import { encode } from 'base-64';

function ProductHome({ route }) {

  const theme = useTheme();

  const { productId } = route.params;

  const [productRating, setProductRating] = useState(0);

  const [comments, setComments] = useState([]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const { user } = useContext(AuthContext);

  const [commentText, setCommentText] = useState("");

  const [commentRating, setCommentRating] = useState(0);

  const [brand, setBrand] = useState(null);
  const [product, setProduct] = useState(null);

  const [isSaved, setIsSaved] = useState(false);

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
      const result = await productActionsApi.getProductComments(productId);

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
        productId,
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

  const getProductById = async (_id) => {
    try {
      const result = await productActionsApi.getProductById(_id);

      setProduct(result);

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

  // Fetch products when the component mounts and when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setIsRefreshing(true); // Set refreshing state to true when the screen comes into focus
      getProductById(productId);
      getProductComments();
    }, [])
  );

  // useEffect with dependency on the product state variable
  useEffect(() => {
    // Check if product is not null and its productDetails property is present
    if (product && product.productDetails && product.productDetails.brand) {
      // Call getBrandById when product is not null
      getBrandById(product.productDetails.brand)
        .then((brandData) => {
          // Handle the retrieved brand data here if needed
        })
        .catch((error) => {
          console.error('Error fetching brand data:', error);
        });
    }
  }, [product]); // Dependency array with product as the dependency

  const onRefresh = () => {
    setIsRefreshing(true); // Set refreshing state to true when the user pulls down to refresh
    getProductComments();
  };

  const Item = ({ item }) => {
    const [isLiked, setIsLiked] = useState(false);
  
    const handleLikePress = () => {
      setIsLiked(!isLiked);
      // Add logic here to handle liking/unliking the item in your data or API
    };
  
    return (
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
            onPress={handleLikePress}
            style={{ borderRadius: 5}}
            activeOpacity={0.5} // Customize the opacity when pressed
          >
            {isLiked ? (
              <MaterialCommunityIcons
              name={"heart"}
              size={20}
              color={theme["notification-error"]}
            />
            ) : (
              <MaterialCommunityIcons
            name={"heart-outline"}
            size={20}
            color={theme["color-primary-disabled-border"]}
          />
            )}
            
          </TouchableOpacity>
        </View>
      </View>
    );
  };  

  const handleSavedPress = () => {
    setIsSaved(!isSaved);
    // Add logic here to handle liking/unliking the item in your data or API
  };
  
  return (
    <Page>
      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
      {product ? (
          <Heading style={{color: theme["color-primary-default"]}}>{product.barcode}</Heading>
      ) : (
        <Heading>...</Heading>
      )}
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
            fill={theme["color-primary-active-border"]} // Set the color of the icon
          />
        </TouchableOpacity>

        
        <View style={{ marginRight: 10 }} />
        <TouchableOpacity
            onPress={handleSavedPress}
            style={{ borderRadius: 5}}
            activeOpacity={0.5} // Customize the opacity when pressed
          >
          <MaterialCommunityIcons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isSaved ? theme['color-primary-active-border'] : theme['color-primary-disabled-border']}
          />
        </TouchableOpacity>
        
        </View>
      </View>

      <View style={{ flexDirection: "column", alignItems: "center",justifyContent: "center" }}>
        <Paragraph>{productRating}</Paragraph>
        <StarRating
          rating={productRating}
          onChange={() => {}}
          animationConfig={{scale: 1}}
          starSize={20}
          starStyle={{marginHorizontal: 0}}
        />
      </View>
      
      <View style={{ flexDirection: "column" }}>
        
            {product && product.images && Array.isArray(product.images) && product.images.length > 0 ? (
              <View style={{ maxHeight: 200 }}>
              <FlatList
                data={product.images}
                keyExtractor={(item, index) => index.toString()}
                horizontal={false}
                numColumns={3}
                renderItem={({ item, index }) => (
                  <View style={{ marginVertical: 5, marginRight: 10 }}>
                    <View style={{ position: 'relative' }}>
                      
                    {item && item.contentType && item.data && item.data.data && item.data.data.length > 0 && (
                      <Image 
                        source={{ uri: 'data:' + item.contentType + ';base64,' + encode(item.data.data.map(byte => String.fromCharCode(byte)).join('')) }}
                        style={{ width: 100, height: 100, borderRadius: 10 }}
                      />
                    )}
                    </View>
                  </View>
                )}
              />
            </View>
            ) : brand && brand.image && brand.image.data && brand.image.data.data ? (
              <View style={{ height: 100, width: 100, alignSelf: "center" }}>
              <View style={{ flex: 1, justifyContent: "center", borderRadius: 5, overflow: "hidden", backgroundColor: "gray" }}>
              <Image 
                source={{ uri: 'data:' + brand.image.contentType + ';base64,' + encode(brand.image.data.data.map(byte => String.fromCharCode(byte)).join('')) }}
                style={{flex: 1, width: null, height: null}} 
              />
              </View>
              </View>
            ) : (
              <View style={{ height: 100, width: 100, alignSelf: "center" }}>
              <View style={{ flex: 1, justifyContent: "center", borderRadius: 5, overflow: "hidden", backgroundColor: "gray" }}>
              <Icon
                name="image-outline"
                width={24}
                height={24}
                fill={theme["color-basic-600"]}
                style={{alignSelf: "center"}}
              />
              </View>
              </View>
            )}

      
          
        
          <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            {product ? (
            <SubHeading>{product.productDetails.name}</SubHeading>
            ) : (
              <SubHeading>...</SubHeading>
            )}
            
            
            {brand ? (
              <Paragraph>{brand.name}</Paragraph>
            )  : (
              <Paragraph>No brand available</Paragraph>
            )} 
          
        </View>
      </View>

      <View style={{ marginVertical: 5, flexDirection: "row", alignItems: "center" }}>
        <View style={{ borderRadius: 5, flexDirection: "row", marginRight: 5 }}>
          <Icon
            name="eye-outline"
            width={24} // Set the width of the icon
            height={24} // Set the height of the icon
            fill={theme["color-primary-disabled-border"]} // Set the color of the icon
          />
          <Paragraph style={{color: theme["color-primary-disabled-border"]}}>5450</Paragraph>
        </View>
        <View  style={{ borderRadius: 5, flexDirection: "row", marginRight: 5 }}>
          <Icon
            name="share-outline"
            width={24} // Set the width of the icon
            height={24} // Set the height of the icon
            fill={theme["color-primary-disabled-border"]} // Set the color of the icon
          />
          <Paragraph style={{color: theme["color-primary-disabled-border"]}}>5450</Paragraph>
        </View>
        <View style={{ borderRadius: 5, flexDirection: "row", marginRight: 5 }}>

          <MaterialCommunityIcons
            name={"cube-scan"}
            size={24}
            color={theme["color-primary-disabled-border"]}
          />
          <Paragraph style={{color: theme["color-primary-disabled-border"]}}>5450</Paragraph>
        </View>
        <TouchableOpacity activeOpacity={0.5} onPress={()=>{}} style={{ borderRadius: 5, flexDirection: "row", marginLeft: 'auto' }}>

          
          <Icon
            name="funnel-outline"
            width={24} // Set the width of the icon
            height={24} // Set the height of the icon
            fill={theme["color-primary-active-border"]} // Set the color of the icon
          />
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
              colors={[theme['color-primary-default']]} // Array of colors
              progressBackgroundColor={theme["background-basic-color-2"]} // Background color of the indicator
            />
          }
          />
      </View>
      <View style={[styles.commentContainer, { flexDirection: "column", height: 100, alignItems: "center", justifyContent: "center", marginTop: 10, backgroundColor: theme["background-basic-color-1"] }]}>
        
        <View style={{ paddingHorizontal: 7, paddingVertical: 0, flexDirection: "row", alignItems: "center", height: 48 }}>
          <View style={{flex: 1, height: 48}}>
            <TextInput
              placeholder="Comment..."
              keyboardType="default"
              returnKeyType="next"
              autoCapitalize="none"
              value={commentText}
              onChangeText={setCommentText}
            />
          </View>
          <View style={{padding: 3}}>
            <TouchableOpacity
              onPress={()=>{
                addCommentToProduct();
              }} 
              style={[styles.button, {backgroundColor: theme["color-primary-default"]}]}
              activeOpacity={0.7} // Customize the opacity when pressed
            >
              <MaterialCommunityIcons
                name={"send"}
                size={24}
                style={{marginLeft: 2, color: theme["background-basic-color-2"]}}
              />
            </TouchableOpacity>
          </View>
        </View>

        <StarRating
          rating={commentRating}
          onChange={setCommentRating}
          style={{marginTop: 5}}
          animationConfig={{scale: 1}}
          starSize={35}
          starStyle={{marginHorizontal: 0, marginVertical: 0}}
        />
      </View>
      
    </Page>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: 'center',
    height: "100%",
    aspectRatio: 1,
    marginLeft: 5,
    borderRadius: 50, // Optional: Customize the border radius
  },
  text: {
    fontSize: 16,
    color: 'black', // Customize the text color
  },
  commentContainer: {
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default ProductHome;
