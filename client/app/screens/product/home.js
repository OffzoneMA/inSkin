
import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
} from "react-native";
import { deviceWidth } from '../../constants/constants'
import AppText from '../../components/AppText'
import { LocalesMessages } from '../../constants/locales'
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, images } from '../../constants';
import { MaterialIcons } from '@expo/vector-icons';
import CustomHeaderView from '../../components/CustomHeaderView'
import Page from "../../components/Page";
import Heading from "../../components/Heading";
import Label from "../../components/Label";
import SubHeading from "../../components/SubHeading";
import Paragraph from "../../components/Paragraph";
import { useTheme } from "@ui-kitten/components";
import StarRating from 'react-native-star-rating-widget';
import ProductReviewCard from '../../components/ProductReviewCard'
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RatingView from '../../components/RatingView'
import productActionsApi from "../../api/product_actions";
import AppCommentTextArea from '../../components/AppCommentTextArea';
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation
import { useNavigation } from "@react-navigation/native";
import brandActionsApi from "../../api/brand_actions";
import style from '../style';
import authApi from "../../api/auth";
import AuthContext from "../../contexts/auth";
import { encode } from 'base-64';
import { ScrollView } from "react-native-gesture-handler";
import useApi from "../../hooks/useApi";
import { styles } from "./styles";
import AddCategoryPopup from '../../components/Popups/AddCategoryPopup';
function ProductHome({ route }) {
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const getProfileImageApi = useApi(authApi.getProfileImage);
  const theme = useTheme();
  const navigation = useNavigation();
  const { productId } = route.params;
  const [productRating, setProductRating] = useState(0);
  const [productIds, setProductId] = useState(null);
  const [comments, setComments] = useState([]);
  const [showAddEditCategoryModal, setShowAddEditCategoryModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const[likedUserIds,setLikedUserIds]= useState(null);
  const { user } = useContext(AuthContext);

  const [commentText, setCommentText] = useState("");

  const [commentRating, setCommentRating] = useState(0);

  const [brand, setBrand] = useState(null);
  const [product, setProduct] = useState(null);
  const [isBookmarked, setIsBookmarked] = React.useState(false)
  const [showCategoryModal, setShowCategoryModal] = React.useState(false)
  const [isSaved, setIsSaved] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favoriteList2, setFavoriteList2] = useState([]);
  const [selectedCategoryTitleForEdit, setSelectedCategoryTitleForEdit] = useState('')
  const [bookmarkedProducts, setBookmarkedProducts] = useState({});
  const [liked, setLiked] = useState(false);
  const getfavoriteproducts = async () => {
    try {
      const result = await authApi.allfavoriteproducts()
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
            
            return acc; // Si la catégorie est déjà présente, on ne l'ajoute pas
          }
        }, []);
        const favoriteProductIds = result.data.map(item => item.productId)
        if (favoriteProductIds.includes(productId)) {
          setIsBookmarked(true);  // Si le produit est trouvé, le marquer comme favori
        } else {
          setIsBookmarked(false); // Sinon, le marquer comme non favori
        }
        setFavoriteList2(uniqueCategories)
      }
      
    } catch (error) {
      console.error("Error getting product data: ", error);
    }
  };
  const handleRemoveFavorite = async (productId1) => {
    try {
      const userId = user._id; // Assurez-vous que user.userId est correctement défini
      console.log(" userId", userId);
      console.log("productId", productId1);
      const updatedFavorites = await authApi.removlistFavoris(userId, productId1);
      console.log("supprission de favorie",updatedFavorites)
      if(updatedFavorites.ok){
        setIsBookmarked(false);
        console.log("setIsBookmarked",isBookmarked);
      alert('Produit retiré des favoris');
      getfavoriteproducts();
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const handleAddFavorite = async (productId, selectedCategory) => {
    try {
      
      if (!user._id|| !productId || !selectedCategory) {
        console.error("Missing required parameters");
        return;
      }
      
      const updatedFavorites = await authApi.addToFavorites(user._id, productId, selectedCategory);
      console.log("updatedFavorites",updatedFavorites);
      if(updatedFavorites.ok){
        setIsBookmarked(true);
        console.log('Produit ajouté aux favoris avec succès!');
        
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
    }
  };
  
  
  useFocusEffect(
    React.useCallback(() => {
      getfavoriteproducts();
      setIsRefreshing(true); 
      
      
      
    }, [])
  );


  
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
      console.log("productId",productId)
      const result = await productActionsApi.getProductComments(productId);
       console.log("resullltttt",result);
      if (!result.ok) {
        //toast.show(result.data, { type: "danger" });
      } else {
        const userIds = result.data.map(comment => comment.userId).filter(id => id);
        //console.log("userids",userIds);
        const usernamesIds = await authApi.getUsersByIds(userIds);
        //console.log("mais moi ",usernamesIds)
        // Create a list of comments with usernames
        const comments = result.data.map(comment => {
          const user = usernamesIds.find(u => u._id === comment.userId);
          
          //console.log("user",user);
          return {
              ...comment,
              userName: user ? user.userName : 'Unknown User' ,// Handle the case if user is not found
              profileImage: user && user.profileImage && user.profileImage.data ? user.profileImage : 'Unknown User',
              
              firstName:user ? user.firstName : 'Unknown User' ,
          };
          
        });
        //console.log("comments", comments);
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

      const result = await productActionsApi.addCommentToProduct(
        productId,
        user._id,
        commentText,
        commentRating
      );
      console.log("commentaire ",result);
      setCommentRating(0);
      setCommentText("");
      onRefresh();
    } catch (error) {
      console.log("Error fetching data: ", error);
      console.error("Error fetching data: ", error);
    }
  };
  const handleLike = async () => {
    try {
      console.log("vous avez ajouter un like")
      const result = await productActionsApi.addlikeToProduct(productId, user._id, 1); 
      console.log("vous avez ajouter un like",result); 
      setLiked(true);
    } catch (error) {
      console.error("Échec de l'ajout du like :", error); // Afficher un message d'erreur si l'ajout échoue
    }
  };
  
  const getProductById = async (_id) => {
    try {
      const result = await productActionsApi.getProductById(_id);
      console.log("les infor sur produit choisi",result)
      setProduct(result);
      const likedUserIds = result.likes.map(like => like.userId);
      setLikedUserIds(likedUserIds);
      if (likedUserIds.includes(user._id)) {
        console.log("user id",user._id)
        setLiked(true);  // Si le produit est trouvé, le marquer comme favori
      } else {
        console.log("user id",user._id)
        setLiked(false); 
      }
      console.log("Liste des IDs des utilisateurs ayant liké:", likedUserIds);
      if (!result.ok) {
        //toast.show(result.data, { type: "danger" });
      } else {
        
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
    
   
  };  
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'; // Formater en K avec une décimale
    }
    return num.toString();
  };
  const renderComment1 = (comment, index) => (
    <View key={index} style={styles.comment}>
      <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <Text style={styles.commentName}>{comment.text}</Text>
        <Text style={styles.commentDate}>{comment.date}</Text>
        <Text style={styles.commentText}>{comment.comment}</Text>
        <View style={styles.reactions}>
          <View style={styles.reaction}>
            <Text style={styles.reactionText}><Icon name="caret-up" size={20} color="#EA6479" /> {formatNumber(comment.upvotes)}</Text>
          </View>
          <View style={styles.reaction}>
            <Text style={styles.reactionText}><Icon name="caret-down" size={20} color="#EA6479" /> {formatNumber(comment.downvotes)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
  const renderComment = (item, index) => {
    // Format the date to only show YYYY-MM-DD
    const formattedDate = new Date(item.createdAt).toLocaleDateString('en-CA'); // en-CA format gives YYYY-MM-DD
    let imageUrl = null;
    if (item.profileImage && item.profileImage.data && item.profileImage.data.data) {
        const imageData = item.profileImage.data.data;
        const base64ImageData = imageData.map(byte => String.fromCharCode(byte)).join('');
        imageUrl = 'data:' + item.profileImage.contentType + ';base64,' + encode(base64ImageData);
    }

    return (
      <View style={styles.reviewContainer}>
        <View
          style={{
          flexDirection: 'row',
        }}>
           {imageUrl ? (
                 <Image 
                source={{ uri: imageUrl }}
                style={styles.reviewerImage}
            />
        ) : (
            <Image 
                source={images.userAvatar} // Utilisez une image par défaut si imageUrl est null
                style={styles.reviewerImage}
            />
        )}
        
        <View
          style={{
            marginLeft: 13,
          }}>
              <AppText
            text={item.firstName}
            style={styles.reviewerName}
            size={'font14px'}
            fontFamily='medium'
          />
          <AppText text={formattedDate} style={styles.reviewDateText} size={'font14px'} />
          </View>
        </View>
        
        {item.text !== "" ? <AppText text={item.text} style={styles.reviewText} numberOfLines={5} size={'font14px'} /> : null}

        <View style={styles.reviewLikeUnLikeContainer}>
        <TouchableOpacity>
          <Image source={images.upTriangle} style={styles.reviewLikeImage} />
        </TouchableOpacity>
        <AppText text='12k' size='font12px' style={styles.reviewCountText} />
        <TouchableOpacity>
          <Image
            source={images.upTriangle}
            style={[
              styles.reviewLikeImage,
              {
                marginLeft: 5,
                transform: [{ rotate: '180deg' }],
                opacity: 0.8,
              },
            ]}
          />
        </TouchableOpacity>
        <AppText text='8k' size='font12px' style={styles.reviewCountText} />
      </View>
      </View>
    );
  };
  const handleSavedPress = () => {
    setIsSaved(!isSaved);
    // Add logic here to handle liking/unliking the item in your data or API
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView  automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        keyboardDismissMode='interactive'>
           <CustomHeaderView
          title={LocalesMessages.countraMix}
          leftButtonImage={images.backButton}
          leftButtonOnPress={() => {
            navigation.goBack()
          }}
          rightButtonImage={images.share}
          rightButtonOnPress={() => {}}
          isFromProfileMenu={false}
        />
      {product && product.images && product.images.length > 0 ? (
    <View >
      {product.images[0] && product.images[0].contentType && product.images[0].data && product.images[0].data.data && product.images[0].data.data.length > 0 && (
        <Image 
          source={{ uri: 'data:' + product.images[0].contentType + ';base64,' + encode(product.images[0].data.data.map(byte => String.fromCharCode(byte)).join('')) }}
          style={styles.productImage}

        />  
      )}
    </View>
  ) : (
    <Image source={images.homeCarouselAvatar} style={styles.productImage} />
  )}
     <View style={styles.productRatingContainer}>
     <View style={styles.flexRowWithCenterItem}>
     <RatingView rating={productRating} startImageStyle={styles.ratingStarImage} />
     {/* <StarRating
          rating={productRating}
          onChange={() => {}}
          animationConfig={{scale: 1}}
          starSize={20}
          starStyle={{marginHorizontal: 0}}
        /> */}
        <AppText
              text={productRating}
              style={[styles.likeCountFont, { color: colors.black }]}
              size='font14px'
            />
      </View>
      <View style={styles.flexRowWithCenterItem}>
            <Image source={images.thumbsUp} style={styles.thumbsUpImage} />
            {likedUserIds ? (
            <AppText text={likedUserIds.length} style={styles.likeCountFont} size='font12px' />
            ) : (
              <AppText text="0" style={styles.likeCountFont} size='font12px' />
            )}
            
            <Image source={images.eye} style={styles.eyeImage} />
            <AppText text="40" style={styles.likeCountFont} size='font12px' />
            <Image source={images.productShare} style={styles.productShareImage} />
            <AppText text="60" style={styles.likeCountFont} size='font12px' />
          </View>
    </View>
    <View style={styles.productDetailsContainer}>
          <View style={{ maxWidth: '60%' }}>
          {product ? (
            <AppText
              text={product.productDetails.name}
              style={styles.productName}
              size={'font20px'}
              fontFamily='medium'
            />
            
            ) : (
              <SubHeading>...</SubHeading>
            )}
            {brand ? (
              <AppText
              text={brand.name}
              style={styles.productSubDesc}
              size={'font14px'}
              
            />
            )  : (
              <Text style={styles.productBrand}>No brand available</Text>
            )} 
          </View>
          <View style={styles.flexRowWithCenterItem}>
            <TouchableOpacity
              onPress={() => {
                if (isBookmarked) {
                  // Si l'icône est marquée (le produit est déjà dans les favoris)
                  handleRemoveFavorite(productId); // Appeler la fonction pour retirer des favoris
                } else {
                  // Si l'icône n'est pas marquée (le produit n'est pas encore dans les favoris)
                  setProductId(productId); // Mettre à jour l'état avec l'ID du produit
                  setShowAddEditCategoryModal(true); // Afficher le modal pour ajouter une catégorie
                }
              }}>
              <Image
                source={isBookmarked ? images.bookmark_selected : images.bookmark}
                style={styles.bookmarkImage}
              />
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => { handleLike(); }}>
            <Image
            source={ liked? images.heart_marked: images.heart}
            style={[
            styles.heartImage,
            
        ]}
      />
            </TouchableOpacity>
          </View>

    </View>
    <View
          style={{
            marginTop: 22,
          }}>
          <AppText
            text={LocalesMessages.description}
            style={styles.productName}
            size={'font18px'}
          />
          <AppText
            text="wiahdhdhcvdieryftddfdy hdfudi0thr7rtgcgdrstsysu"
            style={[styles.productSubDesc, { marginTop: 8 }]}
            size={'font14px'}
          />
        </View>
        <View
          style={[
            styles.flexRowWithCenterItem,
            { marginTop: 24, justifyContent: 'space-between' },
          ]}>
          <AppText
            text={LocalesMessages.comments}
            style={styles.productName}
            size={'font18px'}
            fontFamily='medium'
          />
          <TouchableOpacity style={styles.flexRowWithCenterItem}>
            <AppText
              text={LocalesMessages.mostRecent}
              style={styles.mostRecentText}
              size={'font14px'}
            />
            <Image source={images.arrowThin} style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 22,
          }}>
         {comments.map((comment, index) => renderComment(comment, index))}
          <AppCommentTextArea
            placeholderText={LocalesMessages.addAComment}
            textValue={commentText}
            onChangeText={text => {
              setCommentText(text)
            }}
            onPressSendButton={() => { addCommentToProduct(); }}
          />
          <View style={styles.assessmentRatingContainer}>
            <AppText
              text={LocalesMessages.yourAssessment}
              size={'font12px'}
            />
            <StarRating
          rating={commentRating}
          onChange={setCommentRating}
          style={{marginTop: 5}}
          animationConfig={{scale: 1}}
          starSize={35}
          starStyle={{marginHorizontal: 0, marginVertical: 0}}
        />
          </View>
        </View>

        </ScrollView>
      
        <AddCategoryPopup
        listecategorie={favoriteList2} 
        isVisible={showAddEditCategoryModal}
        editTitle={selectedCategoryTitleForEdit}
        isFromFavorite={false}
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
      
    </SafeAreaView>
  );
}

const styles1 = StyleSheet.create({
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
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  productImage: {
    width: '200',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 10,
    marginTop: 32,
  },
  star: {
      marginVertical: 8,
      flexDirection: 'row',
      // justifyContent: 'space-around',
      marginLeft:2,

  },
  productInfo: {
    marginTop: 10,
  //   alignItems: 'center',
  },
  productTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  productBrand: {
    fontSize: 16,
    color: 'gray',
  },
  starContainer: {
    flexDirection: 'row',
  },
  productStats: {
    flexDirection: 'row',
    marginVertical: 3,
    justifyContent: 'space-between',
    width: '40%',
    marginLeft: 40,
  },
  productStat: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 14,
  },
  productDescription: {
    // marginTop: 2,
    fontSize: 16,
    color: 'gray',
  },
  descriptionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  product:{
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  iconContainer: {
      flexDirection: 'row',
      // justifyContent: 'space-around',
      width: '18%',
      marginTop:14,
  },
  iconButton: {
      marginLeft: 6,
  },
  commentsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  comment: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentContent: {
    marginLeft: 8,
    flex: 1,
  },
  
  commentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  commentDate: {
    fontSize: 14,
    color: '#888',
    marginLeft:3,
    marginTop:2,
  },

  commentText:{
    fontSize: 14,
    marginVertical: 6,
    color: '#888',
  },

  reactions: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: 4,
  },
  reaction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight:10,
  },

  reactionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#888',
  },

  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    // borderRadius: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
    // elevation: 2,
    margin: 10,
  },

  commentInput: {
    flex: 1,
    height: 45,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  
  sendButton: {
    backgroundColor: '#EA6479',
    borderRadius: 6,
    padding: 10,
  },
});

export default ProductHome;
