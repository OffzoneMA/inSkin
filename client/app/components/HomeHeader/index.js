import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { styles } from './styles'
import { images } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { Route } from '../../constants/constants'
import authApi from "../../api/auth";
import useApi from "../../hooks/useApi";
import { encode } from 'base-64';
import AuthContext from "../../contexts/auth";
import authStorage from "../../utilities/authStorage";
import { useState ,useContext} from "react";
import { useFocusEffect } from "@react-navigation/native";
const HomeHeader = () => {
  const navigation = useNavigation()
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const getProfileImageApi = useApi(authApi.getProfileImage);
  const authContext = useContext(AuthContext);
  const { user } = useContext(AuthContext);
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
  return (
    <View style={styles.container}>
      <View style={styles.appTitleContainer}>
        <Image source={images.appTitle} style={styles.appTitleImage} />
      </View>
      <View style={styles.rightActionButtonContainer}>
        <TouchableOpacity activeOpacity={0.6}>
        {selectedImageUri ? (
                  <Image 
                    source={{ uri: selectedImageUri }}
                    style={styles.userAvatarImage}
                  />
                ) : (
                  <Image source={images.userAvatar} style={styles.userAvatarImage} />
                )} 
         
        </TouchableOpacity>
        <View style={styles.notificationBadge} />
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            navigation.navigate(Route.NotificationListScreen)
          }}>
          <View style={styles.bellIconContainer}>
            <Image source={images.bellIcon} style={styles.bellIcon} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default HomeHeader
