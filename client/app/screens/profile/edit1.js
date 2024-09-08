import React, { useContext } from "react";
import { StyleSheet, View, Image, ScrollView, TouchableOpacity ,Alert} from "react-native";
import { useTheme, Text, Icon } from "@ui-kitten/components";
import AuthContext from "../../contexts/auth";
import authStorage from "../../utilities/authStorage";
import { colors } from '../../constants';
//import { useToast } from "react-native-toast-notifications";
import { images } from '../../constants';
import * as ImagePicker from "expo-image-picker";
import AppIconButton from '../../components/AppIconButton';
import { useState } from "react";
import { Route, myProfileOptions } from '../../constants/constants'
import authApi from "../../api/auth";
import useApi from "../../hooks/useApi";
import ProfileOptionView from '../../components/ProfileOptionView';
import { LocalesMessages } from '../../constants/locales'
import { encode } from 'base-64';

import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Formik } from "formik";
import * as Yup from "yup";

// Components
import Page from "../../components/Page";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";

import jwt_decode from "jwt-decode"

const validationSchema = Yup.object({
  firstName: Yup.string().required().label("First Name"),
  lastName: Yup.string().required().label("Last Name"),
  email: Yup.string().required().email().label("Email"),
  currentPassword: Yup.string()
        .when('newPassword', {
          is: (newPassword) => newPassword == undefined || newPassword.length == 0,
          then: (schema) => schema.label("Current Password"),
          otherwise: (schema) => schema.required('Current password is required').label("Old Password"),
        }),
  newPassword: Yup.string().min(4)
        .when('newPasswordConfirmation', {
          is: (newPasswordConfirmation) => newPasswordConfirmation == undefined || newPasswordConfirmation.length == 0,
          then: (schema) => schema.label("New Password"),
          otherwise: (schema) => schema.required('New password is required').label("New Password"),
        }),
  newPasswordConfirmation: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .label("Confirm New Password")
});


function ProfileEdit1({ navigation }) {
  const updateUserInfoApi = useApi(authApi.updateUserInfo);

  const authContext = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  //const toast = useToast();

  const theme = useTheme();
  
  const [alertBox, setAlertBox] = useState(null);

  const [selectedImageUri, setSelectedImageUri] = useState(null); // Step 1: State for selected image URI

  const updateProfileImageApi = useApi(authApi.updateProfileImage);
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
    }
  };
 
  async function modifyProfileImage() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    console.log("status",status)
    if (status == "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      console.log("rsult",result);
      if (!result.canceled) {
        setSelectedImageUri(result.assets[0].uri); // Step 2: Update selected image URI
        //console.log(result.assets[0]);
        //toast.show("Logout Successful", { type: "success" });
           console.log("changemnet d image de profile")
        const uriParts = result.assets[0].uri.split('.');
        const fileExtension = uriParts[uriParts.length - 1];

        const image = {
          uri: result.assets[0].uri,
          type: 'image/' + fileExtension, // Dynamically set the image type based on the file extension
          name: 'image.' + fileExtension, // Dynamically set the file name with the extracted extension
        };
      console.log("user._id inside ",user._id)
        const uploadResult = await updateProfileImageApi.request(user._id, image);
        console.log("hdhdhdh",uploadResult)
      } else{
        console.log("cancelde");
      }
    }
    if (status !== "granted") {
      setAlertBox("Une autorisation d'accès aux fichiers est requise pour télécharger la photo.");
    }
    setTimeout(() => {
      setAlertBox(null);
    }, 5000);
  }

  const saveHandler = async ({
    _id,
    firstName,
    lastName,
    currentPassword,
    newPassword,
  }) => {
    var readerType;
    var readerGoals;
    var readerGenres;
    try {
      readerType = route.params.readerType;
      readerGoals = route.params.readerGoals;
      readerGenres = route.params.readerGenres;
    } catch (e) {
      readerType = null;
      readerGoals = [];
      readerGenres = [];
    }

    

    const result = await updateUserInfoApi.request(
      _id,
      firstName.trim(),
      lastName.trim(),
      currentPassword,
      newPassword,
      readerType,
      readerGoals,
      readerGenres
    );

    if (!result.ok) {
      //toast.show(result.data, {type: "danger"});
      return;
    }

    //toast.show(result.data.message, {type: "success"});

    setTimeout(() => {
      var { user } = jwt_decode(result.headers["bearer-token"]);
      authContext.setUser(user);
      authStorage.removeToken();
      authStorage.storeToken(result.headers["bearer-token"]);

      navigation.goBack();
    }, 300);
  };

  const onCancelClick = () => {
    navigation.goBack();
  }

  // Fetch products when the component mounts and when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      getProfileImage();
    }, [])
  );

  // Placeholder for user profile data
  const userProfile = {
    profilePicture:"person",
    _id: user ? user._id : null,
    firstName: user ? user.firstName : null,
    lastName: user ? user.lastName : null,
    email: user ? user.email : null,
  };
  const handleLogOut = () => {
    setTimeout(() => {
      authContext.setUser(null);
      authStorage.removeToken();
    }, 300);
  };
  const onPressPersonalDetail = () => {
    navigation.navigate("ProfileEdit")
    //navigation.navigate(Route.PersonalDetailScreen)
  }
  const onPressSocialMediaProfile = () => {
    navigation.navigate(Route.SocialMediaListScreen)
  }
  const onPressNotifications = () => { Alert.alert(
    LocalesMessages.logoutTitle, // Titre de l'alerte
    LocalesMessages.areYouSureYouWantLeaveTheApp, // Message de l'alerte
    [
      {
        text: LocalesMessages.cancel,
        style: 'cancel', // Style du bouton "Annuler"
      },
      {
        text: LocalesMessages.confirm,
        style: 'destructive', // Style du bouton "Confirmer"
        onPress: () => handleLogOut(), // Action lorsque l'utilisateur confirme
      },
    ],
    { cancelable: true } // Permet de fermer l'alerte en cliquant en dehors
  );}
  const onPressSettings = () => {
    navigation.navigate(Route.SettingScreen)
  }
  const onPressLegal = () => {
    navigation.navigate(Route.LegalInfoScreen)
  }
  const onPressLogout = () => {
    Alert.alert(
      LocalesMessages.logoutTitle, // Titre de l'alerte
      LocalesMessages.areYouSureYouWantLeaveTheApp, // Message de l'alerte
      [
        {
          text: LocalesMessages.cancel,
          style: 'cancel', // Style du bouton "Annuler"
        },
        {
          text: LocalesMessages.confirm,
          style: 'destructive', // Style du bouton "Confirmer"
          onPress: () => handleLogOut(), // Action lorsque l'utilisateur confirme
        },
      ],
      { cancelable: true } // Permet de fermer l'alerte en cliquant en dehors
    );
  };
  const onPressOption = index => {
    if (index == 0) {
      onPressPersonalDetail()
    } else if (index == 1) {
      onPressSocialMediaProfile()
    } else if (index == 2) {
      onPressNotifications()
    } else if (index == 3) {
      onPressSettings()
    } else if (index == 4) {
      onPressLegal()
    } else if (index == 5) {
      onPressLogout()
    }
  }

  const menuItems = [
    {
      id: 1,
      icon: images.personalDetail,
      text: LocalesMessages.personalDetail,
      soustext: LocalesMessages.personalDetailDesc,
      iconColor: 'purple',
      onPress: () => navigation.navigate("ProfileEdit"),
    },
    {
        id: 2,
        icon: images.socialMediaProfile,
        text:  LocalesMessages.socialMediaProfile,
        soustext: LocalesMessages.socialMediaProfileDesc,
        iconColor: 'purple',
        onPress: () => navigation.navigate("ProfileSaved"),
      },
    {
      id: 3,
      icon: images.notificationsProfile,
      text: LocalesMessages.notifications,
      soustext: LocalesMessages.notificationsDesc,
      iconColor: 'purple',
      onPress: () => navigation.navigate("ProfileAbout"),
    },
    {
      id: 4,
      icon: images.settingLegal,
      text:  LocalesMessages.settings,
      soustext: LocalesMessages.settingsDesc,
      iconColor: 'purple',
      onPress: () => navigation.navigate("ProfileSettings"),
    },
    {
        id: 5,
        icon: images.settingLegal,
        text: LocalesMessages.legal,
        soustext: LocalesMessages.legalDesc,
        iconColor: 'purple',
        onPress: () => navigation.navigate("ProfileSettings"),
      },
    {
      id: 6,
      icon: images.logout,
      text: LocalesMessages.logout,
      soustext:"",
      iconColor: theme["notification-error"],
      onPress: handleLogOut,
    },
  ];


  return (
    <Page>
      <View style={styles.mainContainer}>
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
          {/* Floating button for uploading profile picture */}
          
          <TouchableOpacity
            onPress={modifyProfileImage}
            style={[styles.actionButtonIcon, { borderColor: theme["background-basic-color-2"], borderWidth: 3, borderRadius: 5, bottom: -10, right: -15, position: "absolute", margin: 5, padding: 8, borderRadius: 100,width: 40, height: 40, backgroundColor: theme["background-basic-color-1"] }]}>
              <Icon name="download-outline" fill={theme["color-primary-default"]} style={styles.actionButtonIcon} />
              
          </TouchableOpacity>
        </View>
        </View>
      <View style={styles.nameFollowerContainer}>
              <View style={styles.nameContainer}>
              <Text style={[styles.profileName, { fontSize: 13 }]}>
                  {userProfile.firstName} {userProfile.lastName}
             </Text>
                <Image source={images.paidProfile} style={styles.paidProfileImage} />
              </View>
              <View style={styles.followerPostContainer}>
                <TouchableOpacity style={styles.followersContainerButton}>
                  <Text style={styles.followersNumber}>5</Text>
                  <Text style={[styles.profileName, { fontSize: 13, fontWeight: 'normal' }]}>{LocalesMessages.followers}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.followersContainerButton}>
                  <Text style={styles.followersNumber}>2</Text>
                  <Text style={[styles.profileName, { fontSize: 13, fontWeight: 'normal' }]}>{LocalesMessages.posts}</Text>
                </TouchableOpacity>
              </View>
            </View>
        
          
           {menuItems.map((item, index) => {
              return (
                <ProfileOptionView
                  key={index}
                  leftImageSource={item.icon}
                  titleText={item.text}
                  descText={item.soustext}
                  rightImageSource={images.arrowIcon}
                  rightImageStyle={styles.optionArrowImage}
                  onPress={() => {
                    onPressOption(index)
                  }}
                  isHideDivider={item.isHideDivider}
                />
              )
            })}
         </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    marginBottom: 1,
  },
  followerPostContainer: {
    flexDirection: 'row',
  },
  followerPostText: {
    marginLeft: 6,
  },
  nameFollowerContainer: {
    marginTop: 12,
  },
  paidProfileImage: {
    width: 20,
    height: 20,
    marginLeft: 6,
  },
  profilePictureContainer: {
    borderRadius: 100,
    marginBottom: 10,
    borderWidth: 2,
    padding: 2,
    width: 80,
    height: 80,
  },
  mainContainer: {
    marginTop: 26,
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'column',
     alignItems: "center",
  },
  optionArrowImage: {
    transform: [{ rotate: '180deg' }],
    tintColor: colors.lightBlackSecondary,
  },
  imageLoadButtonContainer: {
    width: 56,
    height: 32,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  profileUserName: {
    fontSize: 18,
    color: 'black',
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
    color: 'black',
    
  },
  soustext:{
    color: 'black',
    
    fontSize: 13,
  },
  profileUserName: {
    fontSize: 18,
  },
  secondaryIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 200,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
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
    color: 'black',
  },
  leftImageTitleContainer: {
    flexDirection: 'row',
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
  avatarContainer: {
    width: 109,
    height: 93,
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
    
    width: 40,
    height: 40,
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
    
    width:18,
    height: 20,
  },
  separator: {
    height: 1, // Adjust the width of the white line as needed
    width: "100%",
    alignSelf: "center",
    marginVertical: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    marginBottom: 1,
    marginRight:20,
    

  },
  leftImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },

});

export default ProfileEdit1;
