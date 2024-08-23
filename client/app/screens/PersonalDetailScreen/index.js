import React, { useState,useContext } from 'react'
import { SafeAreaView, View } from 'react-native'
import CustomHeaderView from '../../components/CustomHeaderView'
import { colors, images } from '../../constants'
import { LocalesMessages } from '../../constants/locales'
import styles from './styles'
import AppText from '../../components/AppText'
import AppTextInput from '../../components/AppTextInput'
import AppButton from '../../components/AppButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { selectUserProfile } from '../../redux/selector/appSelectors'
import { useAppDispatch } from '../../redux/store'
import { updateUserProfile } from '../../redux/slices/app/appSlice'
import { Route } from '../../constants/constants'
import useScreenTracking from '../../hooks/screenTracking'
import authApi from "../../api/auth";
import useApi from "../../hooks/useApi";
import { encode } from 'base-64';
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation
import { Formik } from "formik";
import * as Yup from "yup";
import jwt_decode from "jwt-decode"
import AuthContext from "../../contexts/auth";
import authStorage from "../../utilities/authStorage";
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
const PersonalDetailScreen = () => {
  const navigation = useNavigation()
  const userProfileSelector = useSelector(selectUserProfile)
  const dispatch = useAppDispatch()
  const [userName, setUserName] = useState(userProfileSelector.userName)
  const [firstName, setFirstName] = useState(userProfileSelector.firstName)
  const [lastName, setLastName] = useState(userProfileSelector.lastName)
  const [email, setEmail] = useState(userProfileSelector.email)
  const [phoneNumber, setPhoneNumber] = useState(userProfileSelector.phoneNumber)
  useScreenTracking(navigation, Route.PersonalDetailScreen)
  const onPressSubmit = () => {
    dispatch(
      updateUserProfile({
        ...userProfileSelector,
        userName: userName || '',
        firstName: firstName || '',
        lastName: lastName || '',
        email: email?.trim(),
      }),
    )
    navigation.goBack()
  }
  
  const updateUserInfoApi = useApi(authApi.updateUserInfo);
  const authContext = useContext(AuthContext);
  const { user } = useContext(AuthContext);
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

  const userProfile = {
    profilePicture:"person",
    _id: user ? user._id : null,
    userName: user ? user.userName : null,
    firstName: user ? user.firstName : null,
    lastName: user ? user.lastName : null,
    email: user ? user.email : null,
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <CustomHeaderView
            leftButtonImage={images.backButton}
            title={LocalesMessages.personalDetailSmall}
            leftButtonOnPress={() => {
              navigation.goBack()
            }}
            isFromProfileMenu={true}
          />
          <View style={styles.subMainContainer}>
            <AppText
              text={LocalesMessages.editConfirmYourPersonalInformation}
              size='font15px'
              fontFamily='medium'
              color={colors.lightBlackSecondary}
            />
            <View style={styles.textInputMainContainer}>
              <AppTextInput
                labelTitle={LocalesMessages.userName}
                value={userProfile.userName}
                onChangeText={text => {
                  setUserName(text)
                }}
              />
              <AppTextInput
                labelTitle={LocalesMessages.firstName}
                value={userProfile.firstName}
                onChangeText={text => {
                  setFirstName(text)
                }}
              />
              <AppTextInput
                labelTitle={LocalesMessages.lastName}
                value={userProfile.lastName}
                onChangeText={text => {
                  setLastName(text)
                }}
              />
              <AppTextInput
                labelTitle={LocalesMessages.emailAddress}
                leftImageSource={images.email}
                value={userProfile.email}
                onChangeText={text => {
                  setEmail(text)
                }}
              />
              {/* <AppTextInput
                labelTitle={LocalesMessages.phoneNumber}
                isPhoneNumber={true}
                value={phoneNumber}
                onChangeText={text => {
                  setPhoneNumber(text)
                }}
              /> */}
            </View>
            <AppButton
              localizedText={LocalesMessages.confirm}
              buttonStyle={styles.confirmButton}
              labelStyle={[styles.confirmButtonText]}
              onPress={saveHandler}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default PersonalDetailScreen;
