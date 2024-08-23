import React, { useState , useEffect,useContext} from "react";
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeProductListView from './HomeProductListView';
import { deviceWidth } from '../../constants/constants';
import Icon from 'react-native-vector-icons/Ionicons';
import AppText from "../../components/AppText";
import {colors, images} from "../../constants";
import ProductItemView from '../../components/ProductItemView'
import FavoriteListData from '../../../data/favoriteData.json'
import FavoriteFilterData from '../../../data/favoriteFilterData.json'
import ProductListEmptyView from '../../components/ProductListEmptyView'
import { LocalesMessages } from '../../constants/locales'
import AddCategoryPopup from '../../components/Popups/AddCategoryPopup'
import ActionModal from '../FavoriteScreen/ActionModal'
import { LocalizationContext } from '../../contexts/LocalizationContext'
import { useNavigation } from '@react-navigation/native'
import { Route } from '../../constants/constants'
import FilterModal from '../FavoriteScreen/FilterModal';
import { Alert } from 'react-native';

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
import brandActions from "../../api/brand_actions";
import authApi from "../../api/auth";
//import { useToast } from "react-native-toast-notifications";
import HomeHeader from "../../components/HomeHeader";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation

import { useTheme} from "@ui-kitten/components";

import StarRating from 'react-native-star-rating-widget';

import { encode } from 'base-64';
import AuthContext from "../../contexts/auth";
function DiscoverHome({ navigation }) {
  //const toast = useToast();
  const [comments, setComments] = useState([]);
  const [product, setProduct] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [followedProducts, setFollowedProducts] = useState([]);
  const theme = useTheme();
  const [isFollowingAccounts, setIsFollowingAccounts] = useState();
  const [favoriteList, setFavoriteList] = useState([])
  const [showFilterModal, setShowFilterModal] = useState(false);
  const authContext = useContext(AuthContext);
  const [showAddEditCategoryModal, setShowAddEditCategoryModal] = useState(false)
  const [selectedCategoryTitleForEdit, setSelectedCategoryTitleForEdit] = useState('')
  const [showActionModal, setShowActionModal] = useState(false)
  const [isSearchFilterApplied, setIsSearchFilterApplied] = useState(false)
  const { user } = useContext(AuthContext);
  const [productId, setProductId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [bookmarkedProducts, setBookmarkedProducts] = useState({});
  const [favoriteList2, setFavoriteList2] = useState([]);
  const [favoriteList1, setFavoriteList1] = useState([]);
  const getAllComments = async () => {
    try {
      const result = await productActionsApi.getAllProducts();
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
  const getBrandById=async(_id)=>{
    try{
      const result= await brandActions.getBrandById(_id);
     
    }catch (error) {
      console.error("Error getting product data: ", error);
    }
  }
  const getfollowedproducts = async () => {
    try {
      const result = await productActionsApi.getfollowedproducts();
      setProduct(result);
      getBrandById(result.productBrand)
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
  const handleRemoveFavorite = async (productId1) => {
    try {
      const userId = user._id; // Assurez-vous que user.userId est correctement défini
      console.log(" userId", userId);
      console.log("productId", productId1);
      const updatedFavorites = await authApi.removlistFavoris(userId, productId1);
      console.log("supprission de favorie",updatedFavorites)
      
      if(updatedFavorites){
        setBookmarkedProducts(prevState => ({
          ...prevState,
          [productId]: false // Marque le produit comme favori
        }));
      alert('Produit retiré des favoris');
      getfavoriteproducts();
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const getfavoriteproducts = async () => {
    try {
      const result = await authApi.allfavoriteproducts()
      console.log("rs",result);
      if (result.ok) {

        const uniqueCategories = result.data.reduce((acc, current) => {
          const x = acc.find(item => item.category === current.category);
          if (!x) {
            return acc.concat([{
              ...current,
              id: acc.length + 1, // Génère un ID unique pour chaque élément
              isSelected: false,
            }]);
          } else {
            console.log("Catégorie déjà présente:", current.category);
            return acc; // Si la catégorie est déjà présente, on ne l'ajoute pas
          }
        }, []);
        const favorites = result.data.reduce((acc, item) => {
            acc[item.productId] = true;
            return acc;
          }, {});
          console.log("favorites",favorites);
        setBookmarkedProducts(favorites);
        setFavoriteList2(uniqueCategories)
      }
      
    } catch (error) {
      console.error("Error getting product data: ", error);
    }
  };
  
  const handleAddFavorite = async (productId, selectedCategory) => {
    try {
      
      if (!user._id|| !productId || !selectedCategory) {
        console.error("Missing required parameters");
        return;
      }
      // const result = await authApi.getFavorites(user._id);
      // console.log("liste des favoris ",result);
      const updatedFavorites = await authApi.addToFavorites(user._id, productId, selectedCategory);
      if(updatedFavorites.ok){
        setBookmarkedProducts(prevState => ({
          ...prevState,
          [productId]: true 
        }));
        console.log('Produit ajouté aux favoris avec succès!');
        Alert.alert('Succès', 'Produit ajouté aux favoris avec succès!');
      }
      
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
    }
  };
  
  
  useFocusEffect(
    React.useCallback(() => {
      getfavoriteproducts();
      setIsRefreshing(true); 
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
      console.log("les produits disponibles ", {
        _id: result._id,
        barcode: result.barcode,
        productDetails: result.productDetails,
        // Filtrage des images si elles sont volumineuses
        images: result.images ? result.images.map(img => ({ _id: img._id, contentType: img.contentType })) : [],
      });
      navigation.navigate('Product', { productId: result._id });
    } catch (error) {
      console.error("Error getting product data: ", error);
    }
  };
  
  
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
    <View style={styles.card}>
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={[styles.item1, { backgroundColor: '#F4F4F4' }]} 
      onPress={() => { getProductById(item.productId); }}
    >
      <View style={{ alignItems: 'center' }}>
        {item.images && item.images.length > 0 && (
          <Image
            source={{ uri: `data:${item.images[0].contentType};base64,${item.images[0].data}` }}
            style={styles.productImage}
          />
        )}
        {!item.images || item.images.length === 0 && (
          <View style={{ width: '100%', height: 200, aspectRatio: 16/9, justifyContent: 'center', alignItems: 'center' }}>
            <MaterialIcons name="image" size={40} color="black" />
          </View>
        )}
        
       
        <View style={styles.postDetails}>
              <View style={styles.postDetails}>
                  <Text style={styles.postTitle}> {item.productName}</Text>
              </View>
              <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="bookmark-outline" size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="chatbubble-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>
            </View>
          
          {item.comments && item.comments.length > 0 && (
            <View>
             
              {item.comments.map((comment, index) => (
                <View key={index}>
                  <SubHeading>{comment.text}</SubHeading>
                  {/* Afficher d'autres détails du commentaire si nécessaire */}
                </View>
              ))}
            </View>
          )}
        
      </View>
    </TouchableOpacity>
    </View>
  );
  
  
  
  

  
  return (
    <Page style={{color: "red"}}>
      <HomeHeader/>
      
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
            renderItem={({ item }) => {
              return <HomeProductListView item={item} onPressBookMark={() => {
                if (bookmarkedProducts[item.productId]) {
                  // Si l'icône est marquée (le produit est déjà dans les favoris)
                  handleRemoveFavorite(item.productId); // Appeler la fonction pour retirer des favoris
                } else {
                  // Si l'icône n'est pas marquée (le produit n'est pas encore dans les favoris)
                  setProductId(item.productId); // Mettre à jour l'état avec l'ID du produit
                  setShowAddEditCategoryModal(true); // Afficher le modal pour ajouter une catégorie
                }
              }}
              onPressproduct={()=> {getProductById(item.productId);}}
              isBookmarked={bookmarkedProducts[item.productId] || false}
              />
            }}
            showsVerticalScrollIndicator={false}
          />
        <FlatList
        data={isSearchFilterApplied ? FavoriteFilterData.favoriteList : favoriteList}
        numColumns={2}
        horizontal={false}
        style={styles.body}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <ProductItemView
              key={index}
              isFromFavoriteList={true}
              item={item}
              onPressOption={() => setShowActionModal(true)}
              onPressItem={() => {
                navigation.navigate(Route.FavoriteDetailScreen, {
                  listName: item.favoriteListName,
                })
              }}
            />
          )
        }}
        
      />
      <AddCategoryPopup
        listecategorie={favoriteList2} 
        isVisible={showAddEditCategoryModal}
        editTitle={selectedCategoryTitleForEdit}
        isFromFavorite={true}
        onPressClose={() => {
          setShowAddEditCategoryModal(false)
        }}
        onPressAdd1={() => {
          handleAddFavorite(productId, selectedCategory);
        }}
        onPressAdd={(selectedCategory) => {
          console.log("principale selectedCategory",selectedCategory)
          handleAddFavorite(productId, selectedCategory);
        }}
        onChangeText={(text) => setSelectedCategory(text)}
       
      />
      <FilterModal
        isVisible={showFilterModal}
        onPressClose={() => {
          setShowFilterModal(false)
        }}
        onApplyPress={() => {
          setIsSearchFilterApplied(true)
        }}
      />
      <ActionModal
        isVisible={showActionModal}
        onPressClose={() => setShowActionModal(false)}
        onPressEditCategory={() => {
          setShowActionModal(false)
          setSelectedCategoryTitleForEdit(FavoriteFilterData.favoriteList[0].favoriteListName)
          setTimeout(() => {
            setShowAddEditCategoryModal(true)
          }, 800)
        }}
        onPressDeleteCategory={() => {
          setShowActionModal(false)
          const options = [
            { text: translate(LocalesMessages.cancel) },
            {
              text: translate(LocalesMessages.confirm),
              style: 'destructive',
              onPress: () => {},
            },
          ]
          Alert.alert('', translate(LocalesMessages.areYouSureDeleteCategory), options)
        }}
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
  cardContainer: {
    minHeight: 430,
    width: deviceWidth - 40,
    alignSelf: 'center',
    marginTop: 22,
  },
  productImage: {
    height: 210,
    width: deviceWidth - 40,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  productNameText: {
    lineHeight: 24,
    color:'black'
    
  },
  productNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productActionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.black,
  },
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  postImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  postDetails: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleBrandContainer: {
    flexDirection: 'column',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    
  },
  postBrand: {
    fontSize: 14,
    color: '#888',
    marginLeft: 60,
  },
  
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  postDate: {
    fontSize: 14,
    color: '#888',
    marginLeft:20,
    marginTop:2,
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 2,
  },
  postContent: {
    // fontSize: 16,
    // color: '#555',
    marginTop: 10,
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    marginLeft:20,
  },
  reactions: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: 4,
    marginLeft:18,
  },
  reaction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart:4,
    marginRight:14,
  },
  reactionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
});

export default DiscoverHome;
