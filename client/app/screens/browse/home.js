import React, { useState } from "react";
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  SafeAreaView,
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  RefreshControl,
  Image,
  TouchableOpacity,
  Button,
  Text
} from "react-native";

import Page from "../../components/Page";
import Heading from "../../components/Heading";
import Label from "../../components/Label";
import SubHeading from "../../components/SubHeading";
import Paragraph from "../../components/Paragraph";

import productActionsApi from "../../api/product_actions";
import authApi from "../../api/auth";
//import { useToast } from "react-native-toast-notifications";

import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation

import { useTheme, Icon } from "@ui-kitten/components";

import StarRating from 'react-native-star-rating-widget';

import { encode } from 'base-64';

function DiscoverHome({ navigation }) {
  //const toast = useToast();
  const [comments, setComments] = useState([]);
  const [product, setProduct] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [followedProducts, setFollowedProducts] = useState([]);
  const theme = useTheme();
  const [isFollowingAccounts, setIsFollowingAccounts] = useState();
  const getAllComments = async () => {
    try {
      const result = await productActionsApi.getAllProducts();
      console.log("les produit wiam ", result)
     
      if (!result.ok) {
        //toast.show(result.data, { type: "danger" });
      } else {
        //toast.show(result.data.message, { type: "success" });
        // Sort the comments array by 'createdAt' property in descending order
        const sortedComments = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setComments(sortedComments);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsRefreshing(false); // Set refreshing state to false after data fetch is completed
    }
  };
  const getfollowedproducts = async () => {
    try {
      const result = await productActionsApi.getfollowedproducts();
      console.log("les produit des compte suivi ", result)
      setProduct(result);
      
      if (!result.ok) {
        
      } else {
        // Trier les produits par date de création
        const sortedProducts = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setFollowedProducts(sortedProducts); 
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
      getAllComments();
      getfollowedproducts();
    }, [])
  );

  const onRefresh = () => {
    setIsRefreshing(true); // Set refreshing state to true when the user pulls down to refresh
    getAllComments();
   
  };
  

  const getProductById = async (_id) => {
    try {
      const result = await productActionsApi.getProductById(_id);
      console.log("les produit desponible ",result)
      navigation.navigate('Product', { productId: result._id });
  
    } catch (error) {
      console.error("Error getting product data: ", error);
    }
  }
  const handleDelete = (userId) => {
    // Filtrer les commentaires pour exclure celui avec l'ID utilisateur spécifié
    const updatedComments = comments.filter(comment => comment.userId !== userId);
    setComments(updatedComments); // Mettre à jour l'état avec la nouvelle liste de commentaires
  };
  const handleFollow1 = async (email) => {
    try {
      console.log(email)
      const response = await authApi.followUser(email); 
      console.log("User followed successfully:", response);
      setIsFollowingAccounts(true);
      const updatedComments = comments.map(comment => {
        if (comment.email === email) {
          return { ...comment, isFollowing: true }; // Mettez à jour le commentaire avec l'état suivant
        } else {
          return comment;
        }
      });
      setComments(updatedComments);
    } catch (error) {
      console.error("Error following user:", error);
      
    }
  };
  

  const Item = ({ item ,handleFollow, handleDelete}) => (
    
    
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={[styles.item, {backgroundColor: '#F4F4F4'}]} 
      onPress={() => { getProductById(item._id); }}
    >
      
    
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <MaterialIcons style={{ position: 'absolute', top: 8, right: 8 }} name="close" size={24} color="black" onPress={() => handleDelete(item.userId)} />
      <View style={[styles.profileIconWrapper, {width: 100, borderRadius: 100, marginBottom: "auto", backgroundColor: theme['color-primary-disabled-border'], aspectRatio: 1, overflow: 'hidden', justifyContent: "center"}]}>
  {item.profileImage && item.profileImage.data ? (
    <Image 
      source={{ uri: `data:${item.profileImage.contentType};base64,${item.profileImage.data}` }}
      style={[styles.profilePicture, { flex: 1, width: null, height: null }]}
    />
  ) : (
    <Icon
      name="image-outline"
      width={24}
      height={24}
      fill={theme["background-basic-color-1"]}
      style={{alignSelf: "center"}}
    />
  )}
</View>

        <View style={{ flex: 1, flexDirection:"column"}}>
  <SubHeading style={{ marginLeft: 4, marginBottom: 30, color: 'black'}}>{item.userName}</SubHeading>
  <Button onPress={() => handleFollow1(item.email)} title={item.isFollowing ? "following" : "follow"} />
</View>

      
    </View>

    </TouchableOpacity>
  );
  const FollowedProductItem = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={[styles.item1, { backgroundColor: '#F4F4F4' }]} 
      onPress={() => { getProductById(item.productId); }}
    >
      <View style={{ alignItems: 'center' }}>
        {item.images && item.images.length > 0 && (
          <Image
            source={{ uri: `data:${item.images[0].contentType};base64,${item.images[0].data}` }}
            style={{ width: 330, height: 200,  resizeMode: 'cover', borderRadius:20 }}
          />
        )}
        {!item.images || item.images.length === 0 && (
          <View style={{ width: '100%', height: 200, aspectRatio: 16/9, justifyContent: 'center', alignItems: 'center' }}>
            <MaterialIcons name="image" size={40} color="black" />
          </View>
        )}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center' }}>
          <SubHeading style={{ color: 'black' }}>{item.productName}</SubHeading>
          <View style={{ flexDirection: 'row' }}>
            <MaterialIcons name="bookmark-border" size={30} color="black" style={{ marginLeft: 100 }} />
            <MaterialIcons name="chat-bubble-outline" size={30} color="black" />
          </View>
          {item.comments && item.comments.length > 0 && (
            <View>
              <Paragraph>Comments:</Paragraph>
              {item.comments.map((comment, index) => (
                <View key={index}>
                  <SubHeading>{comment.text}</SubHeading>
                  {/* Afficher d'autres détails du commentaire si nécessaire */}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  
  
  
  

  
  return (
    <Page style={{color: "red"}}>
      <Heading>Browse</Heading>
      {followedProducts.length === 0 && ( // Condition pour afficher le texte uniquement si l'utilisateur ne suit pas encore de compte
        <>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: 'black', fontWeight: 'bold', textAlign: 'center', fontSize: 25 }}>Welcome to INSKINE</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ textAlign: 'center', fontSize: 18 }}><Text style={{ textAlign: 'center' }}>
              Follow people to {'\n'}
              start seeing the products{'\n'}
              and posts they share.
            </Text></Text>
          </View>
        </>
      )}
      <SafeAreaView>
        <FlatList
        horizontal
        
          data={comments}
          renderItem={({ item }) => <Item item={item}  handleDelete={handleDelete} />}
          keyExtractor={(item) => item._id}
          
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[theme['color-primary-default']]} // Array of colors
              progressBackgroundColor={theme["background-basic-color-2"]} // Background color of the indicator
            />
          }
        />
         <FlatList
          data={followedProducts}
          renderItem={({ item }) => <FollowedProductItem item={item}  handleDelete={handleDelete} />}
          keyExtractor={(item) => item.productId}
          
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[theme['color-primary-default']]} // Array of colors
              progressBackgroundColor={theme["background-basic-color-2"]} // Background color of the indicator
            />
          }
        />

       
      </SafeAreaView>
     

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
    padding: 8,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 300,
    width:250,
    margin: 5,
  },
  item1: {
    flexDirection: "row",
    padding: 8,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 300,
    width:500,
    margin: 5,
  },
  title: {
    fontSize: 32,
  },
  profileIconWrapper: {
    borderRadius: 98,
  },
});

export default DiscoverHome;
