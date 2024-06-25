import React, { useContext , useLayoutEffect} from "react";
import { StyleSheet, View, Image, ScrollView,Text, TouchableOpacity,TextInput } from "react-native";
import { useTheme,  Icon, MenuItem, OverflowMenu } from "@ui-kitten/components";
import AuthContext from "../../contexts/auth";
import authStorage from "../../utilities/authStorage";

import { useNavigation } from '@react-navigation/native'; // Importer le hook useNavigation

//import { useToast } from "react-native-toast-notifications";
import style from "../style";
import * as ImagePicker from "expo-image-picker";

import { useState } from "react";

import authApi from "../../api/auth";
import useApi from "../../hooks/useApi";

import { encode } from 'base-64';

import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Formik } from "formik";
import * as Yup from "yup";

// Components
import Page from "../../components/Page";
import Button from "../../components/Button";
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


function ProfileEdit({ navigation }) {
  const updateUserInfoApi = useApi(authApi.updateUserInfo);

  const authContext = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  //const toast = useToast();

  const theme = useTheme();
  
  const [alertBox, setAlertBox] = useState(null);

  const [selectedImageUri, setSelectedImageUri] = useState(null); // Step 1: State for selected image URI

  const updateProfileImageApi = useApi(authApi.updateProfileImage);
  const getProfileImageApi = useApi(authApi.getProfileImage);
  const navigation1 = useNavigation(); // Utiliser le hook useNavigation pour obtenir l'objet de navigation
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [selectedLang, setSelectedLang] = React.useState('fr');
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Personal details', // Définir le titre au centre de la barre de navigation
      headerLeft: () => (
        <TouchableOpacity  onPress={() => navigation.goBack()}>
          <View style={styles.iconWrapper}>
          <Icon name='chevron-left' style={styles.headerIcon} />
          </View>
        </TouchableOpacity>
      ), 
      headerRight: () => (
        <OverflowMenu
          visible={menuVisible}
          anchor={() => (
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <View style={styles.languageIconWrapper}>
                <Icon name='more-vertical' style={styles.languageIcon} />
              </View>
            </TouchableOpacity>
          )}
          onBackdropPress={() => setMenuVisible(false)}
        >
          <MenuItem
            title='Fr'
            onPress={() => {
              setSelectedLang('fr');
              setMenuVisible(false);
              // Logique pour changer la langue
            }}
          />
          <MenuItem
            title='Eng'
            onPress={() => {
              setSelectedLang('en');
              setMenuVisible(false);
              // Logique pour changer la langue
            }}
          />
        </OverflowMenu>
      ),
    });
  }, [navigation]);
  
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
     console.log("ne change pas",result)
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



  return (
    <Page>

        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, paddingHorizontal: 10 }}>
        <View >
             
             <Text style={{ fontSize: 18, marginVertical: 10}}>Edit or confirm your personal information</Text>
            
          </View>
          <Formik
            initialValues={{
              _id: userProfile._id,
              firstName: userProfile.firstName,
              lastName: userProfile.lastName,
              email: userProfile.email,
              currentPassword: "",
              newPassword: "",
              newPasswordConfirmation: "",
            }}
            onSubmit={saveHandler}
            validationSchema={validationSchema}
            validateOnChange={true}
          >
            {({
              handleChange,
              handleSubmit,
              errors,
              setFieldTouched,
              touched,
              values,
            }) => (
              <>
                <ScrollView>
                <Text style={style.label}>First Name</Text>
                <View style={[style.action]}>
                <TextInput
                    style={style.textInput}
                    placeholder="First Name"
                    autoCompleteType="name"
                    keyboardType="default"
                    returnKeyType="next"
                    textContentType="givenName"
                    autoCapitalize="none"
                    value={values.firstName}
                    onChangeText={handleChange("firstName")}
                    errorMessage={errors.firstName}
                    onBlur={() => setFieldTouched("firstName")}
                    errorVisible={touched.firstName}
                    />
                </View>
                   
                    <Text style={style.label}>Last  Name</Text>
                    <View style={[style.action]}>
                    <TextInput
                    style={style.textInput}
                    placeholder="Last Name"
                    autoCompleteType="name"
                    keyboardType="default"
                    returnKeyType="next"
                    textContentType="familyName"
                    autoCapitalize="none"
                    value={values.lastName}
                    onChangeText={handleChange("lastName")}
                    errorMessage={errors.lastName}
                    onBlur={() => setFieldTouched("lastName")}
                    errorVisible={touched.lastName}
                    />
                    </View>
                    <Text style={style.label}>Email Address</Text>
                    <View style={[style.action]}>
                  <TextInput
                  style={style.textInput}
                    placeholder="Email Address"
                    autoCompleteType="email"
                    keyboardType="email-address"
                    returnKeyType="next"
                    textContentType="emailAddress"
                    autoCapitalize="none"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    errorMessage={errors.email}
                    onBlur={() => setFieldTouched("email")}
                    errorVisible={touched.email}
                  />
                  </View>
                  
               <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <Button loading={updateUserInfoApi.loading} title="OK" onPress={handleSubmit} style={{flex: 2, marginRight: 2,borderRadius: 20}}>
                       Confirm
                    </Button>
                    
                </View>
                </ScrollView>
                
                
                
              </>
            )}
          </Formik>
          </KeyboardAwareScrollView>
           
        
      
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
  headerRightButton: {
    marginRight: 60,
  },
  headerIcon: {
    fontSize: 24,
    width: 50,
    height: 24,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    marginRight: 60,
    marginLeft: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)', // Add a background color to make the circle visible
  },
  languageIconWrapper: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  languageIcon: {
    fontSize: 24,
    width: 50,
    height: 24,
  },
});

export default ProfileEdit;