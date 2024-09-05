import { Image, TouchableOpacity, View , Text} from 'react-native'
import React ,{useContext}from 'react'
import { useNavigation } from '@react-navigation/native'
import { Route } from '../../../constants/constants'
import { colors, images } from '../../../constants'
import AppText from '../../../components/AppText'
import RatingView from '../../../components/RatingView'
import { styles } from './styles'
import { LocalesMessages } from '../../../constants/locales'
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from "@react-navigation/native";
import { encode } from 'base-64';
import authApi from "../../../api/auth";
import useApi from "../../../hooks/useApi";
import { useState } from "react";
import AuthContext from "../../../contexts/auth";
import productActionsApi from "../../../api/product_actions";
const HomeProductListView = ({ item, onPressBookMark,onPressproduct,isBookmarked ,onPresslike}) => {
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const getProfileImageApi = useApi(authApi.getProfileImage);
  const { user } = useContext(AuthContext);
  
  const getProfileImage = async () => {
    try {
      const profileImage = await getProfileImageApi.request(item.userIdComm);
      if (profileImage && profileImage.data && profileImage.data.data && profileImage.data.data.data) {
        const imageData = profileImage.data.data.data;
        const base64ImageData = imageData.map(byte => String.fromCharCode(byte)).join('');
        const imageUrl = 'data:' + profileImage.data.contentType + ';base64,' + encode(base64ImageData);
        setSelectedImageUri(imageUrl);
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      
        getProfileImage();
      }
    , [])
  );
  const addlikeToProduct = async () => {
    try {
      const result = await productActionsApi.addlikeToProduct(
        item.productId,
        user._id,
        1
      );
      if (!result.ok) {
        console.error("Erreur lors de l'ajout du like : ", result.problem);
      } else {
        // Afficher un message de succès
        console.log("like ajouté avec succès !");
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  const navigation = useNavigation()
  const binaryToBase64 = (binaryData) => {
    return `data:${binaryData.contentType};base64,${btoa(String.fromCharCode(...binaryData.data))}`;
  };
  const profileImageSource = item.profileImage && item.profileImage.data && item.profileImage.data.data
  ? { uri: binaryToBase64(item.profileImage) }
  : null;
  const imageSource = item.images && item.images.length > 0 
  ? { uri: `data:${item.images[0].contentType};base64,${item.images[0].data}` }
  : null; // Si `item.images` est vide ou non défini, imageSource est `null`
  const imageSourcep = item.profileImage && item.profileImage.length > 0 
  ? { uri: `data:${item.profileImage[0].contentType};base64,${item.profileImage[0].data}` }
  : null;
  const comments = item.comments && item.comments.length > 0 
    ? item.comments 
    : [];
    let imageUrl = null;
    if (item.profileImage && item.profileImage.data && item.profileImage.data.data) {
        const imageData = item.profileImage.data.data;
        const base64ImageData = imageData.map(byte => String.fromCharCode(byte)).join('');
        imageUrl = 'data:' + item.profileImage.contentType + ';base64,' + encode(base64ImageData);
    }

    const formattedDate = new Date(item.createdAt).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
  
return (
  <>
     <View style={styles.cardContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPressproduct}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.productImage}
          />
        ) : (
          <Image source={images.homeCarouselAvatar} style={styles.productImage} /> // Message à afficher si aucune image n'est disponible
        )}
      </TouchableOpacity>
      <View style={styles.productNameContainer}>
          <View
            style={{
              marginTop: 8,
            }}>
             
            <AppText
              text={item.productName}
              style={styles.productNameText}
              size='font16px'
              fontFamily='medium'
            />
            <AppText
              text={LocalesMessages.chanel}
              color={colors.tabBarGray}
              style={styles.productChanelText}
              size='font12px'
            />
          </View>
          <View style={styles.productActionButtonContainer}>
          <TouchableOpacity   onPress={onPressBookMark}>
      
          <Icon
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={isBookmarked ? 'blue' : '#000'}
            tintColor={colors.black}
            style={[{ marginRight: 13 }]}
      />
          </TouchableOpacity>
            <TouchableOpacity>
              <Image source={images.message} style={styles.actionButton} />
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={styles.postDetails}>
        <View style={styles.postDetails}>
              
            <AppText
              text={item.productName}
              style={styles.productNameText}
              size='font16px'
              fontFamily='medium'
            />
            <AppText
              text="chanel"
              color={colors.tabBarGray}
              style={styles.postBrand}
              size='font12px'
            />
          </View>
          <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}  onPress={onPressBookMark}>
          <Icon
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={isBookmarked ? 'blue' : '#000'}
      />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="chatbubble-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>
        </View> */}

        <View style={styles.productDescContainer}>
        {selectedImageUri ? (
          <Image
          source={{ uri: selectedImageUri }}
            style={styles.commentUserAvatar}
          />
        ) : (
          <Image source={images.userAvatar} style={styles.commentUserAvatar} /> // Message à afficher si aucune image n'est disponible
        )}
         <View style={{ marginLeft: 16 }}>
         <View style={{ flexDirection: 'row' }}>
          <AppText
                text={item.userNameComm}
                style={styles.commentUserNameText}
                size='font12px'
              />
              <AppText
                text={formattedDate}
                style={styles.commentDataText}
                size='font10px'
              />
          </View>
           <RatingView rating={item.review}  startImageStyle={styles.ratingViewContainer} />
        </View>
      </View>
      <AppText text={item.text}  size='font12px' style={styles.commentText} />
      {/* {comments.map((comment, index) => (
          <View key={index} style={styles.commentContainer}>
            <AppText
              text={comment.text} // Affichage du texte du commentaire
              style={styles.commentText}
              size='font14px'
            />
            
          </View>
        ))} */}
        <View style={styles.productLikeContainer}>
          <TouchableOpacity onPress={() => { addlikeToProduct(); }}>
            <Image source={images.upTriangle} style={styles.productLikeButton} />
          </TouchableOpacity>
          <AppText text='12k' size='font12px' style={styles.productLikeCountText} />
          <TouchableOpacity>
            <Image
              source={images.upTriangle}
              style={[
                styles.productLikeButton,
                { transform: [{ rotate: '180deg' }], opacity: 0.8, marginLeft: 5 },
              ]}
            />
          </TouchableOpacity>
          <AppText text='8k' size='font12px' style={styles.productLikeCountText} />
        </View>
      </View>
      <View style={styles.dividerView} />
    </>
  )
}

export default HomeProductListView
