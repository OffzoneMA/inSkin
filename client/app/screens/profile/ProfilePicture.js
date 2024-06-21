// Importez les dépendances nécessaires
import React, { useContext, useState } from "react";
import { StyleSheet, View, Image, ScrollView, TouchableOpacity } from "react-native";
import AuthContext from "../../contexts/auth";
import authApi from "../../api/auth";
import useApi from "../../hooks/useApi";
import { encode } from 'base-64';
import { useTheme, Text, Icon } from "@ui-kitten/components";
import { useFocusEffect } from "@react-navigation/native";
// Fonction pour rendre l'image de profil
export const renderProfileImage = () => {
  const { user } = useContext(AuthContext);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const theme = useTheme();
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
  const userProfile = {
    profilePicture:"person",
    firstName: user ? user.firstName : null,
    lastName: user ? user.lastName : null,
    userName: user ? user.userName : null,
  };

  useFocusEffect(() => {
    if (user && user._id) {
      getProfileImage();
    }
  }, []);

  return (
    
    <View style={styles.profileContainer}>
      <View style={[styles.profilePictureContainer, { borderColor: theme["color-primary-default"] }]}>
        <View style={[styles.profileIconWrapper, { overflow: 'hidden', backgroundColor: theme["background-basic-color-1"] }]}>
          {selectedImageUri ? ( // Step 3: Conditionally render selected image or default icon
            <Image 
              source={{ uri: selectedImageUri }} /* style={styles.profilePicture} */ 
              style={[styles.profilePicture, {  flex: 1, width: null, height: null }]} // Use flex to fit the parent container
            />
          ) : (
            <Icon
              name={userProfile.profilePicture}
              style={[styles.profilePicture, {top: 10}]} fill={theme["color-primary-disabled-border"]}
            />
          )}
        </View>
      </View>
      </View>
     
  )
          }
          const styles = StyleSheet.create({
            profileContainer: {
              alignItems: "center",
              marginBottom: 5,
            },
            profilePictureContainer: {
              borderRadius: 100,
              marginBottom: 2,
              marginTop:6,
              marginRight:6,
              borderWidth: 2,
              padding: 2,
              width: 33, // Réduire la largeur de l'icône
              height: 33, // Réduire la hauteur de l'icône
            },
            profileIconWrapper: {
              borderRadius: 98,
              flex: 1,
            },
            profilePicture: {
            },
            profileName: {
              fontSize: 18,
              fontWeight: "bold",
            },
            profileUserName: {
              fontSize: 18,
            },
            followersContainer: {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center", // Align to the left
              marginTop: 10,
            },
            followersContainerButton: {
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center", // Align to the left
              paddingTop: 10,
              paddingHorizontal: 10,
            },
            followersNumber: {
              fontSize: 17,
              fontWeight: "bold",
              justifyContent: "center",
            },
            followersText: {
              fontSize: 15,
              fontWeight: "bold",
              justifyContent: "center",
            },
            editProfileButton: {
              marginTop: 25,
              borderRadius: 20,
              paddingVertical: 12,
            },
            logoutButton: {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start", // Align to the left
              paddingVertical: 10,
              paddingHorizontal: 10,
            },
            logoutText: {
              fontSize: 15,
              marginRight: 10,
              fontWeight: "bold",
            },
            primaryIconWrapper: {
              width: 30,
              height: 30,
              borderRadius: 10, // Make it a circle
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            },
            secondaryIconWrapper: {
              width: 30,
              height: 30,
              borderRadius: 200, // Make it a circle
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "auto",
            },
            logoutIcon: {
              width: 18,
              height: 20,
            },
            separator: {
              height: 1, // Adjust the width of the white line as needed
              width: "100%",
              alignSelf: "center",
              marginVertical: 10,
            },
          
          });
          
          
          
