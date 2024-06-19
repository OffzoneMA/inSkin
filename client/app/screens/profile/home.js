import React, { useContext, useLayoutEffect } from "react";
import { StyleSheet, View, Image, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { useTheme, Text, Icon } from "@ui-kitten/components";
import Page from "../../components/Page";
import AuthContext from "../../contexts/auth";
import authStorage from "../../utilities/authStorage";
import Button from "../../components/Button";
import { useState } from "react";
import authApi from "../../api/auth";
import useApi from "../../hooks/useApi";
import { encode } from 'base-64';
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation

function ProfileHome({ navigation }) {
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

  const handleLogOut = () => {
    setTimeout(() => {
      authContext.setUser(null);
      authStorage.removeToken();
    }, 300);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (user && user._id) {
        getProfileImage();
      }
    }, [])
  );

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
     
    </Page>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  profilePictureContainer: {
    borderRadius: 100,
    marginBottom: 10,
    borderWidth: 2,
    padding: 2,
    width: 80,
    height: 80,
    marginRight: 15,
  },
  profileIconWrapper: {
    borderRadius: 98,
    flex: 1,
  },
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
  },
  followersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    color: 'black',
  },
  followersContainerButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  followersNumber: {
    fontSize: 17,
    fontWeight: "bold",
    justifyContent: "center",
    color: 'black',
  },
  followersText: {
    fontSize: 15,
    fontWeight: "bold",
    justifyContent: "center",
    color: 'black',
  },
  editProfileButton: {
    marginTop: 25,
    borderRadius: 20,
    paddingVertical: 12,
    color: 'black',
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  logoutText: {
    fontSize: 18,
    color: 'black',
    fontWeight: "bold",
  },
  primaryIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  secondaryIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 200,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  logoutIcon: {
    width: 18,
    height: 20,
  },
  separator: {
    height: 1,
    width: "100%",
    alignSelf: "center",
    marginVertical: 10,
  },
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
});

export default ProfileHome;
