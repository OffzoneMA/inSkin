import React from 'react'

import styles from './styles'
import { colors, images } from '../../../constants'
import AppText from '../../../components/AppText'
import AppButton from '../../../components/AppButton'
import { LocalesMessages } from '../../../constants/locales'
import { useSelector } from 'react-redux'
import { selectUserProfile } from '../../../redux/selector/appSelectors'
import { useContext, useLayoutEffect } from "react";
import { StyleSheet, View, Image, ScrollView, SafeAreaView, TouchableOpacity} from "react-native";
import { useTheme, Text, Icon } from "@ui-kitten/components";

import AuthContext from "../../../contexts/auth";
import authStorage from "../../../utilities/authStorage";
import { useState } from "react";
import authApi from "../../../api/auth";
import useApi from "../../../hooks/useApi";
import { encode } from 'base-64';

import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation


const SearchFollowerView = ({ onPressEditProfile,onPressFollowProfile,firstName,lastName,isFollower,posts,followers,userId}) => {
  const authContext = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const [selectedImageUri, setSelectedImageUri] = useState(null);
console.log("fpllowers",followers)
  const getProfileImageApi = useApi(authApi.getProfileImage);

  const getProfileImage = async () => {
    try {
      const profileImage = await getProfileImageApi.request(userId);
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
    text={`${firstName} ${lastName}`}
    size='font14px'
    fontFamily='semiBold'
  />
  {/* Container pour les images Instagram et TikTok */}
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
    <View style={styles.followerPostContainer}>
      <View style={styles.followerContainer}>
      {
  followers === 0 ? (
    <AppText
      text="0"
      size='font14px'
      fontFamily='medium'
      color={colors.lightBlack}
      style={styles.numberText}
    />
  ) : (
    <AppText
      text={followers}
      size='font14px'
      fontFamily='medium'
      color={colors.lightBlack}
      style={styles.numberText}
    />
  )
}
        
        <AppText
          text={LocalesMessages.followers}
          size='font12px'
          color={colors.tabBarGray}
          style={styles.followerPostText}
        />
      </View>
      <View style={styles.postContainer}>
      { posts === 0 ? (
    <AppText
      text="0"
      size='font14px'
      fontFamily='medium'
      color={colors.lightBlack}
      style={styles.numberText}
    />
  ) : (
    <AppText
      text={posts}
      size='font14px'
      fontFamily='medium'
      color={colors.lightBlack}
      style={styles.numberText}
    />
  )
}
        <AppText
          text={LocalesMessages.posts}
          size='font12px'
          color={colors.tabBarGray}
          style={styles.followerPostText}
        />
      </View>
    </View>

    {/* Images Instagram et TikTok alignées à droite */}
    <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
      <Image source={images.instagram}  style={[styles.rightImage]}/>
      <Image source={images.ticktok} style={[styles.rightImage, { marginTop: 5}]}/>
    </View>
  </View>
  
</View>

        
      </View>
      {isFollower ? (
       <AppButton 
       localizedText="Ne plus suivre" 
       onPress={onPressEditProfile} 
       backgroundColor={colors.categoryOptionSelected} // Fond personnalisé
       textColor={colors.pink} // Texte blanc

     />
        
        
      ) : (
        <AppButton localizedText="Suivre" onPress={onPressFollowProfile} />
      )}
      
    </View>
  )
}

export default SearchFollowerView
