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
      <View style={[styles.profilePictureContainer, { borderColor: theme["color-primary-default"] }]}>
              <View style={[styles.profileIconWrapper, { overflow: 'hidden', backgroundColor: theme["background-basic-color-1"] }]}>
                {selectedImageUri ? (
                  <Image 
                    source={{ uri: selectedImageUri }}
                    style={[styles.profilePicture, { flex: 1, width: null, height: null }]}
                  />
                ) : (
                  <Icon
                    name={userProfile.profilePicture}
                    style={[styles.profilePicture, { top: 10 }]}
                    fill={theme["color-primary-disabled-border"]}
                  />
                )}
              </View>
              </View>
        <View style={styles.nameFollowerMainContainer}>
          
          <Text style={[styles.profileName, { fontSize: 13 }]}>
                  {userProfile.firstName} {userProfile.lastName}
             </Text>
          <View style={styles.followerPostContainer}>
            <View style={styles.followerContainer}>
              <AppText
                text='120'
                size='font12px'
                fontFamily='medium'
                color={colors.lightBlack}
                style={styles.numberText}
              />
              <AppText
              text={LocalesMessages.followers}
                size='font12px'
                color={colors.tabBarGray}
                style={styles.followerPostText}
              />
            </View>
            <View>
              <AppText
                text='34'
                size='font12px'
                fontFamily='medium'
                color={colors.lightBlack}
                style={styles.numberText}
              />
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
