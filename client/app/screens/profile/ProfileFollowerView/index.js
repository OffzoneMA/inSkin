import React from 'react'

import styles from './styles'
import { colors, images } from '../../../constants'
import AppText from '../../../components/AppText'
import AppButton from '../../../components/AppButton'
import { LocalesMessages } from '../../../constants/locales'
import { useSelector } from 'react-redux'
import { selectUserProfile } from '../../../redux/selector/appSelectors'
import { useContext, useLayoutEffect } from "react";
import { StyleSheet, View, Image, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { useTheme, Text, Icon } from "@ui-kitten/components";
import productActionsApi from "../../../api/product_actions";
import AuthContext from "../../../contexts/auth";
import authStorage from "../../../utilities/authStorage";
import { useState } from "react";
import authApi from "../../../api/auth";
import useApi from "../../../hooks/useApi";
import { encode } from 'base-64';

import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation


const ProfileFollowerView = ({ onPressEditProfile }) => {
  const authContext = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [productCount, setProductCount] = useState(null);
  const [folowedCount, setfolowedCount] = useState(null);
  const getProfileImageApi = useApi(authApi.getProfileImage);

  const getProfileImage = async () => {
    try {
      const profileImage = await getProfileImageApi.request(user._id);
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
  const getmyproductcount = async () => {
    try {
      const result = await productActionsApi.getmyproductcount();
      product=result.data;
      if (!result.ok) {
        console.error("Erreur lors de la récupération des favoris");
        return;
      } else{
        product=result.data;
        setProductCount(product)
      }
    } catch (error) {
      console.error("Error getting product data: ", error);
    }
  };
  const getmyfollowerscount = async () => {
    try {
      const result = await authApi.getmyfollowerscount();
      product=result.data;
      if (!result.ok) {
        console.error("Erreur lors de la récupération des favoris");
        return;
      } else{
        product=result.data;
        setfolowedCount(product)
      }
    } catch (error) {
      console.error("Error getting product data: ", error);
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      getmyproductcount();
      getmyfollowerscount();
      if (user && user._id) {
        getProfileImage();
      }
    }, [])
  );
  const userProfile = {
    profilePicture: "person",
    firstName: user ? user.firstName : null,
    lastName: user ? user.lastName : null,
    userName: user ? user.userName : null,
    
  };
  
  return (
    <View>
      <View style={styles.topViewContainer}>
                {selectedImageUri ? (
                  <Image 
                    source={{ uri: selectedImageUri }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Image source={images.userAvatar} style={styles.avatarImage} />
                )} 
                 <View style={styles.nameFollowerMainContainer}>
          <AppText
            text={`${userProfile.firstName} ${userProfile.lastName}`}
            size='font18px'
            fontFamily='semiBold'
          />
          <View style={styles.followerPostContainer}>
            <View style={styles.followerContainer}>
            {folowedCount ? ( <AppText
                text={folowedCount.followerCount}
                size='font12px'
                fontFamily='medium'
                color={colors.lightBlack}
                style={styles.numberText}
              />):( <AppText
                text='0'
                size='font12px'
                fontFamily='medium'
                color={colors.lightBlack}
                style={styles.numberText}
              />)}
              <AppText
              text={LocalesMessages.followers}
                size='font12px'
                color={colors.tabBarGray}
                style={styles.followerPostText}
              />
            </View>
            <View>
            {productCount ? ( <AppText
                text={productCount.productCount}
                size='font12px'
                fontFamily='medium'
                color={colors.lightBlack}
                style={styles.numberText}
              />):( <AppText
                text='0'
                size='font12px'
                fontFamily='medium'
                color={colors.lightBlack}
                style={styles.numberText}
              />)}
             
              <AppText
              text={LocalesMessages.posts}
                size='font12px'
                color={colors.tabBarGray}
                style={styles.followerPostText}
              />
            </View>
          </View>
        </View>
        
      </View>
      <AppButton localizedText={LocalesMessages.editProfile} onPress={onPressEditProfile} />
    </View>
  )
}

export default ProfileFollowerView
