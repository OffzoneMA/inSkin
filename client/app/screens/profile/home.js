import React, { useContext } from "react";
import { StyleSheet, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { useTheme, Text, Icon } from "@ui-kitten/components";
import Page from "../../components/Page";
import AuthContext from "../../contexts/auth";
import authStorage from "../../utilities/authStorage";
//import { useToast } from "react-native-toast-notifications";
import Button from "../../components/Button";

import * as ImagePicker from "expo-image-picker";

import { useState } from "react";

import authApi from "../../api/auth";
import useApi from "../../hooks/useApi";

import { encode } from 'base-64';

import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation

function ProfileHome({ navigation }) {
  const authContext = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  //const toast = useToast();

  const theme = useTheme();
  
  const [alertBox, setAlertBox] = useState(null);

  const [selectedImageUri, setSelectedImageUri] = useState(null); // Step 1: State for selected image URI

  const updateProfileImageApi = useApi(authApi.updateProfileImage);
  const getProfileImageApi = useApi(authApi.getProfileImage);
  
  const getProfileImage = async () => {
    //toast.show("Logout Successful", { type: "success" });
    const profileImage = await getProfileImageApi.request(user._id);

    // Extract the image data from the response
    const imageData = profileImage.data.data.data;

    // Convert the image data from bytes to a base64 string
    const base64ImageData = imageData.map(byte => String.fromCharCode(byte)).join('');
    const imageUrl = 'data:' + profileImage.data.contentType + ';base64,' + encode(base64ImageData);

    setSelectedImageUri(imageUrl);
  };

  const handleLogOut = () => {
    //toast.show("Logout Successful", { type: "success" });

    setTimeout(() => {
      authContext.setUser(null);
      authStorage.removeToken();
    }, 300);
  };

  async function modifyProfileImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        setSelectedImageUri(result.assets[0].uri); // Step 2: Update selected image URI
        //console.log(result.assets[0]);
        //toast.show("Logout Successful", { type: "success" });

        // Extract file extension from the URI
        const uriParts = result.assets[0].uri.split('.');
        const fileExtension = uriParts[uriParts.length - 1];

        const image = {
          uri: result.assets[0].uri,
          type: 'image/' + fileExtension, // Dynamically set the image type based on the file extension
          name: 'image.' + fileExtension, // Dynamically set the file name with the extracted extension
        };

        const uploadResult = await updateProfileImageApi.request(user._id, image);
        //console.log(uploadResult.message)
      }
    }
    if (status !== "granted") {
      setAlertBox("File permission is required to upoad photo.");
    }
    setTimeout(() => {
      setAlertBox(null);
    }, 5000);
  }

  // Fetch products when the component mounts and when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      getProfileImage();
    }, [])
  );

  // Placeholder for user profile data
  const userProfile = {
    profilePicture:"person-outline",
    firstName: user ? user.firstName : null,
    lastName: user ? user.lastName : null,
    userName: user ? user.userName : null,
  };

  const menuItems = [
    {
      id: 1,
      icon: "bookmark-outline",
      text: "Saved",
      iconColor: theme["color-primary-default"],
      onPress: () => navigation.navigate("ProfileSaved"),
    },
    {
      id: 3,
      icon: "info-outline",
      text: "About",
      iconColor: theme["color-primary-default"],
      onPress: () => navigation.navigate("ProfileAbout"),
    },
    {
      id: 4,
      icon: "settings-outline",
      text: "Settings",
      iconColor: theme["color-primary-default"],
      onPress: () => navigation.navigate("ProfileSettings"),
    },
    {
      id: 5,
      icon: "log-out",
      text: "Log Out",
      iconColor: theme["notification-error"],
      onPress: handleLogOut,
    },
  ];

  return (
    <Page>
      <View style={styles.profileContainer}>
        <View style={[styles.profilePictureContainer, { borderColor: theme["color-primary-default"] }]}>
          <View style={[styles.profileIconWrapper, { overflow: 'hidden', backgroundColor: theme["color-primary-disabled"] }]}>
            {selectedImageUri ? ( // Step 3: Conditionally render selected image or default icon
              <Image 
                source={{ uri: selectedImageUri }} /* style={styles.profilePicture} */ 
                style={[styles.profilePicture, {  flex: 1, width: null, height: null }]} // Use flex to fit the parent container
              />
            ) : (
              <Icon
                name={userProfile.profilePicture}
                style={styles.profilePicture} fill={theme["color-primary-unfocus"]}
              />
            )}
          </View>
          {/* Floating button for uploading profile picture */}
          
          <TouchableOpacity
            onPress={modifyProfileImage}
            style={[styles.actionButtonIcon, { borderColor: "white", borderWidth: 3, borderRadius: 5, bottom: -10, right: -15, position: "absolute", margin: 5, padding: 8, borderRadius: 100,width: 40, height: 40, backgroundColor: theme["color-primary-disabled"] }]}>
              <Icon name="edit-outline" fill={theme["color-primary-default"]} style={styles.actionButtonIcon} />
          </TouchableOpacity>
        </View>

        <View style={{flexDirection: "row"}}>
          <Text style={styles.profileName}>
            {userProfile.firstName} 
          </Text>
          <Text style={styles.profileName}>  </Text>
          <Text style={styles.profileName}>
            {userProfile.lastName}
          </Text>
        </View>

        <Text style={[styles.profileUserName, { fontSize: 13, fontWeight: 'normal', color: theme["text-basic-color"] }]}>
          {userProfile.userName}
        </Text>

        <View style={styles.followersContainer}>
          <TouchableOpacity style={styles.followersContainerButton}>
            <Text style={styles.followersNumber}>10,4m</Text>
            <Text style={[styles.followersText, { fontSize: 13, fontWeight: 'normal', color: theme["text-basic-color"] }]}>Followers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.followersContainerButton}>
            <Text style={styles.followersNumber}>543</Text>
            <Text style={[styles.followersText, { fontSize: 13, fontWeight: 'normal', color: theme["text-basic-color"] }]}>Following</Text>
          </TouchableOpacity>
        </View>
        
        <Button style={styles.editProfileButton}>Edit Profile</Button>
      </View>

      <View style={[styles.separator, { backgroundColor: theme["color-primary-disabled"] }]}></View>

      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.logoutButton} onPress={item.onPress}>
            <View style={[styles.primaryIconWrapper, { backgroundColor: theme["background-basic-color-1"] }]}>
              <Icon name={item.icon} fill={item.iconColor} style={styles.logoutIcon} />
            </View>
            <Text style={styles.menuItemText}>{item.text}</Text>
            <View style={[styles.secondaryIconWrapper, { backgroundColor: theme["background-basic-color-1"] }]}>
              <Icon name="arrow-ios-forward-outline" fill={item.iconColor} style={styles.logoutIcon} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    marginBottom: 5,
  },
  profilePictureContainer: {
    borderRadius: 100,
    marginBottom: 10,
    borderWidth: 2,
    padding: 2,
    width: 80,
    height: 80,
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
    borderRadius: 100,
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

export default ProfileHome;
