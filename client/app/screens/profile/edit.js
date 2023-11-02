import React, { useContext } from "react";
import { StyleSheet, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { useTheme, Text, Icon } from "@ui-kitten/components";
import AuthContext from "../../contexts/auth";
import authStorage from "../../utilities/authStorage";
//import { useToast } from "react-native-toast-notifications";

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
import Heading from "../../components/Heading";
import Paragraph from "../../components/Paragraph";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import TextLink from "../../components/TextLink";

const validationSchema = Yup.object({
    firstName: Yup.string().required().label("First name"),
    lastName: Yup.string().label("Last Name"),
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(4).label("Password"),
    passwordConfirmation: Yup.string()
      .required("Password needs to be confirmed")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

function ProfileEdit({ navigation }) {
  const registerApi = useApi(authApi.register);

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

  const registerHandler = async ({
    firstName,
    lastName,
    email,
    password,
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

    const result = await registerApi.request(
      firstName.trim(),
      lastName.trim(),
      email,
      password,
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
      AsyncStorage.setItem("hasOnboarded", "true");
      var { user } = jwt_decode(result.headers["bearer-token"]);
      authContext.setUser(user);
      authStorage.storeToken(result.headers["bearer-token"]);

      navigation.reset({
        index: 0,
        routes: [{ name: "Tab" }],
      });
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
    profilePicture:"person-outline",
    firstName: user ? user.firstName : null,
    lastName: user ? user.lastName : null,
    userName: user ? user.userName : null,
  };



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
        </View>

        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, paddingHorizontal: 10 }}>
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              passwordConfirmation: "",
            }}
            onSubmit={registerHandler}
            validationSchema={validationSchema}
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
                    <TextInput
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
                    <TextInput
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
                  <TextInput
                    placeholder="Email"
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
                  <TextInput
                    placeholder="Old Password"
                    autoCompleteType="password"
                    keyboardType="default"
                    returnKeyType="next"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    errorMessage={errors.password}
                    onBlur={() => setFieldTouched("password")}
                    errorVisible={touched.password}
                  />
                  <TextInput
                    placeholder="New Password"
                    autoCompleteType="password"
                    keyboardType="default"
                    returnKeyType="done"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    value={values.passwordConfirmation}
                    onChangeText={handleChange("passwordConfirmation")}
                    errorMessage={errors.passwordConfirmation}
                    onBlur={() => setFieldTouched("passwordConfirmation")}
                    errorVisible={touched.passwordConfirmation}
                  />
                  <TextInput
                    placeholder="Confirm New Password"
                    autoCompleteType="password"
                    keyboardType="default"
                    returnKeyType="done"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    value={values.passwordConfirmation}
                    onChangeText={handleChange("passwordConfirmation")}
                    errorMessage={errors.passwordConfirmation}
                    onBlur={() => setFieldTouched("passwordConfirmation")}
                    errorVisible={touched.passwordConfirmation}
                  />

                

                </ScrollView>
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <Button loading={registerApi.loading} title="OK" onPress={handleSubmit} style={{flex: 2, marginRight: 2}}>
                        Save
                    </Button>
                    <Button onPress={onCancelClick} style={{flex: 1, marginLeft: 2, backgroundColor: "#8F9BB3", borderColor: "#8F9BB3"}}>
                        Cancel
                    </Button>
                </View>
                
                
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

});

export default ProfileEdit;
