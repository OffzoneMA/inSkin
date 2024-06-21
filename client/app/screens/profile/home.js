<<<<<<< HEAD
import React, { useContext } from "react";
import { StyleSheet, View, Image, ScrollView, TouchableOpacity } from "react-native";
=======
import React, { useContext, useLayoutEffect } from "react";
import { StyleSheet, View, Image, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
import { useTheme, Text, Icon } from "@ui-kitten/components";
import Page from "../../components/Page";
import AuthContext from "../../contexts/auth";
import authStorage from "../../utilities/authStorage";
<<<<<<< HEAD
//import { useToast } from "react-native-toast-notifications";
import Button from "../../components/Button";

import { useState } from "react";

import authApi from "../../api/auth";
import useApi from "../../hooks/useApi";

import { encode } from 'base-64';

=======
import Button from "../../components/Button";
import { useState } from "react";
import authApi from "../../api/auth";
import useApi from "../../hooks/useApi";
import { encode } from 'base-64';
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation

function ProfileHome({ navigation }) {
  const authContext = useContext(AuthContext);
  const { user } = useContext(AuthContext);
<<<<<<< HEAD
  //const toast = useToast();

  const theme = useTheme();

  const [selectedImageUri, setSelectedImageUri] = useState(null); // Step 1: State for selected image URI

  const getProfileImageApi = useApi(authApi.getProfileImage);
  
  const getProfileImage = async () => {
    try {
        //toast.show("Logout Successful", { type: "success" });
        const profileImage = await getProfileImageApi.request(user._id);

        // Check if profileImage is defined and has the data property
        if (profileImage && profileImage.data && profileImage.data.data && profileImage.data.data.data) {
            // Extract the image data from the response
            const imageData = profileImage.data.data.data;

            // Convert the image data from bytes to a base64 string
            const base64ImageData = imageData.map(byte => String.fromCharCode(byte)).join('');
            const imageUrl = 'data:' + profileImage.data.contentType + ';base64,' + encode(base64ImageData);

            setSelectedImageUri(imageUrl);
        } 
    } catch (error) {
        // Handle other errors that might occur during the API request
        console.error('Error fetching profile image:', error);
        // Handle this error condition as per your application's requirements
=======
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
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
    }
  };

  const handleLogOut = () => {
<<<<<<< HEAD
    //toast.show("Logout Successful", { type: "success" });

=======
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
    setTimeout(() => {
      authContext.setUser(null);
      authStorage.removeToken();
    }, 300);
  };

<<<<<<< HEAD
  // Fetch products when the component mounts and when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if(user && user._id) {
=======
  useFocusEffect(
    React.useCallback(() => {
      if (user && user._id) {
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
        getProfileImage();
      }
    }, [])
  );

<<<<<<< HEAD
  // Placeholder for user profile data
  const userProfile = {
    profilePicture:"person",
=======
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('ProfileEdit1')}
          style={styles.headerRightButton}
        >
           <View style={styles.iconWrapper}>
            <Icon
              name="menu-outline"
              style={styles.headerIcon}
              
            />
          </View>
        </TouchableOpacity>
      ),
      headerTitle: '', // Hide the title
    });
  }, [navigation]);

  const userProfile = {
    profilePicture: "person",
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
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
<<<<<<< HEAD
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
            <Text style={styles.followersNumber}>5</Text>
            <Text style={[styles.followersText, { fontSize: 13, fontWeight: 'normal', color: theme["text-basic-color"] }]}>Followers</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.followersContainerButton}>
            <Text style={styles.followersNumber}>2</Text>
            <Text style={[styles.followersText, { fontSize: 13, fontWeight: 'normal', color: theme["text-basic-color"] }]}>Following</Text>
          </TouchableOpacity>
        </View>
        
        <Button onPress={() => {navigation.navigate("ProfileEdit")}} style={styles.editProfileButton}>Edit Profile</Button>
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
=======
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.profileContainer} showsVerticalScrollIndicator={false}>
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
            <View style={styles.infoContainer}>
              <View style={styles.nameContainer}>
                <Text style={[styles.profileName, { fontSize: 13, fontWeight: 'normal' }]}>
                  {userProfile.firstName}
                </Text>
                <Text style={[styles.profileName, { fontSize: 13, fontWeight: 'normal' }]}>
                  {userProfile.lastName}
                </Text>
              </View>
              <View style={styles.followersContainer}>
                <TouchableOpacity style={styles.followersContainerButton}>
                  <Text style={styles.followersNumber}>5</Text>
                  <Text style={[styles.profileName, { fontSize: 13, fontWeight: 'normal' }]}>Followers</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.followersContainerButton}>
                  <Text style={styles.followersNumber}>2</Text>
                  <Text style={[styles.profileName, { fontSize: 13, fontWeight: 'normal' }]}>Posts</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Button onPress={() => { navigation.navigate("ProfileEdit") }} style={styles.editProfileButton}>Edit Profile</Button>
      <View style={[styles.separator, { backgroundColor: theme["color-primary-disabled"] }]}></View>
     
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
    </Page>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
<<<<<<< HEAD
    alignItems: "center",
=======
    flexDirection: 'row',
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
    marginBottom: 5,
  },
  profilePictureContainer: {
    borderRadius: 100,
    marginBottom: 10,
    borderWidth: 2,
    padding: 2,
    width: 80,
    height: 80,
<<<<<<< HEAD
=======
    marginRight: 15,
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
  },
  profileIconWrapper: {
    borderRadius: 98,
    flex: 1,
  },
<<<<<<< HEAD
  profilePicture: {
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileUserName: {
    fontSize: 18,
=======
  profilePicture: {},
  profileName: {
    fontSize: 16,
    color: 'black',
  },
  infoContainer: {
    flexDirection: 'column',
  },
  profileUserName: {
    fontSize: 18,
    color: 'black',
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
  },
  followersContainer: {
    flexDirection: "row",
    alignItems: "center",
<<<<<<< HEAD
    justifyContent: "center", // Align to the left
    marginTop: 10,
=======
    justifyContent: "center",
    marginTop: 10,
    color: 'black',
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
  },
  followersContainerButton: {
    flexDirection: "column",
    alignItems: "center",
<<<<<<< HEAD
    justifyContent: "center", // Align to the left
=======
    justifyContent: "center",
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  followersNumber: {
    fontSize: 17,
    fontWeight: "bold",
    justifyContent: "center",
<<<<<<< HEAD
=======
    color: 'black',
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
  },
  followersText: {
    fontSize: 15,
    fontWeight: "bold",
    justifyContent: "center",
<<<<<<< HEAD
=======
    color: 'black',
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
  },
  editProfileButton: {
    marginTop: 25,
    borderRadius: 20,
    paddingVertical: 12,
<<<<<<< HEAD
=======
    color: 'black',
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
<<<<<<< HEAD
    justifyContent: "flex-start", // Align to the left
=======
    justifyContent: "flex-start",
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  logoutText: {
<<<<<<< HEAD
    fontSize: 15,
    marginRight: 10,
=======
    fontSize: 18,
    color: 'black',
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
    fontWeight: "bold",
  },
  primaryIconWrapper: {
    width: 30,
    height: 30,
<<<<<<< HEAD
    borderRadius: 10, // Make it a circle
=======
    borderRadius: 10,
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
<<<<<<< HEAD
  secondaryIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 200, // Make it a circle
=======
  nameContainer: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  secondaryIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 200,
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  logoutIcon: {
    width: 18,
    height: 20,
  },
  separator: {
<<<<<<< HEAD
    height: 1, // Adjust the width of the white line as needed
=======
    height: 1,
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
    width: "100%",
    alignSelf: "center",
    marginVertical: 10,
  },
<<<<<<< HEAD

=======
  headerRightButton: {
    marginRight: 20,
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)', // Add a background color to make the circle visible
  },
>>>>>>> 27644d8ea97281bed390c56840de4cd52212b747
});

export default ProfileHome;
