import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import Page from "../../components/Page";
import Heading from "../../components/Heading";
import Label from "../../components/Label";
import SubHeading from "../../components/SubHeading";
import Paragraph from "../../components/Paragraph";

import { useTheme, Icon } from "@ui-kitten/components";

import StarRating from 'react-native-star-rating-widget';

import { MaterialCommunityIcons } from "@expo/vector-icons";

import productActionsApi from "../../api/product_actions";

import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation
import { useNavigation } from "@react-navigation/native";
import brandActionsApi from "../../api/brand_actions";
import style from '../style';
import authApi from "../../api/auth";

import AuthContext from "../../contexts/auth";

import { encode } from 'base-64';

function ProductHome({ route }) {

  const theme = useTheme();
  const navigation = useNavigation();

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
        const sortedComments = comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setComments(sortedComments);
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
      onRefresh();
        
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
      onRefresh();
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
  useEffect(() => {
    if (product) {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => handleShare()}>
            <MaterialIcons name="share" size={24} color="black" />
          </TouchableOpacity>
        ),
        title: product.productDetails.name // Set product name as header title
      });
    }
  }, [navigation, product]);

  // Fonction pour gérer le partage
  const handleShare = () => {
    // Mettez ici la logique pour partager le produit
    console.log("Share product:", product.productDetails.name);
  };
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
        <Text>{item.userName}</Text>
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
      <View style={{ flexDirection: "column", alignItems: "center" }}>
            {product && product.images && Array.isArray(product.images) && product.images.length > 0 ? (
              <View style={{ maxHeight: 300 }}>
              <View style={{ position: 'relative' }}>
                {product.images[0].contentType && product.images[0].data && product.images[0].data.data && product.images[0].data.data.length > 0 && (
                  <Image 
                    source={{ uri: 'data:' + product.images[0].contentType + ';base64,' + encode(product.images[0].data.data.map(byte => String.fromCharCode(byte)).join('')) }}
                    style={{ width: 300, height: 300, borderRadius: 10 }}
                  />
                )}
              </View>
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
              <View style={{ flex: 1, borderRadius: 5, overflow: "hidden", backgroundColor: theme["color-primary-disabled-border"] }}>

              </View>
              </View>
            )}
        <View style={{ flexDirection: "row" }}>
       
        <StarRating
          rating={productRating}
          onChange={() => {}}
          animationConfig={{scale: 1}}
          starSize={20}
          starStyle={{marginHorizontal: 0}}
        />
        <Text style={{ flexDirection: "row" ,Color: 'black'}}>{productRating}</Text>
        <View style={{  flexDirection: "row" ,marginHorizontal: 30}}>
        <View style={{ borderRadius: 5, flexDirection: "row", marginRight: 5 }}>
        <MaterialIcons name="thumb-up-off-alt" size={20}  />
         <Paragraph style={{color: 'black'}}>5450</Paragraph>
        </View>
        <View style={{ borderRadius: 5, flexDirection: "row", marginRight: 5 }}>
        <MaterialIcons name="visibility" size={20}  />
          <Paragraph style={{color: 'black'}}>5450</Paragraph>
        </View>
        <View  style={{ borderRadius: 5, flexDirection: "row", marginRight: 5 }}>
        <MaterialIcons name="share" size={20} color="black" />
          <Paragraph style={{color: 'black'}}>5450</Paragraph>
        </View>
      </View>
      </View>
      
          
        
  <View style={{ flexDirection: "row" }}>
  <View style={{ paddingHorizontal: 80}}> 
    {product ? (
      <Text style={{ fontWeight: 'bold', fontSize:18}}>{product.productDetails.name}</Text>
    ) : (
      <SubHeading>...</SubHeading>
    )}
    <Text style={{ fontWeight: 'bold', fontSize:18}} >Description</Text>
  </View>
  <View style={{ flexDirection: "row",marginHorizontal: 80 }}>
  <TouchableOpacity onPress={() => handleSave()}>
      <MaterialIcons name="bookmark-border" size={24} color="black" />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleLove()}>
      <MaterialIcons name="favorite-border" size={24} color="black" />
    </TouchableOpacity>
  </View>
</View>
      </View>
      <View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
  <Text style={{ fontSize: 16, marginBottom: 10, paddingHorizontal: 10, backgroundColor: 'white', fontWeight: 'bold' }}>les commentaires</Text>
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <TouchableOpacity onPress={() => handleSortComments('recent')} style={{ marginRight: 10 }}>
      <Text style={{ color: 'black' }}>Plus récents</Text>
    </TouchableOpacity>
    
    <TouchableOpacity onPress={() => handleSortComments('old')}>
      <Text style={{ color: 'black' }}>Plus anciens</Text>
    </TouchableOpacity>
  </View>
</View>
      </View>
    <View style={{ flex: 1, paddingTop: 10, backgroundColor: '#F4F4F4', borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}>
  <FlatList
    data={comments}
    renderItem={({ item }) => <Item item={item} textColor="black"/>}
    keyExtractor={(item, index) => {return item._id}}
    refreshControl={
      <RefreshControl
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        colors={[theme['color-primary-default']]}
        progressBackgroundColor={theme["background-basic-color-2"]}
      />
    }
  />
</View>

      <View style={[styles.commentContainer, { flexDirection: "column", height: 100, alignItems: "center", justifyContent: "center", marginTop: 10 }]}>
        
        <View style={{ paddingHorizontal: 7, paddingVertical: 0, flexDirection: "row", alignItems: "center", height: 48 }}>
          <View style={[style.action,{flex: 1, height: 48}]}>
            <TextInput
             style={style.textInput}
              placeholder="Add a Comment..."
              keyboardType="default"
              returnKeyType="next"
              autoCapitalize="none"
              value={commentText}
              onChangeText={setCommentText}
            />
          </View>
          <View style={{padding: 2}}>
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
                style={{ marginLeft: 2, color: 'white', transform: [{ rotate: '-45deg' }] }}
              />
            </TouchableOpacity>
          </View>
        </View>

       
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
    borderRadius: 10, // Optional: Customize the border radius
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
