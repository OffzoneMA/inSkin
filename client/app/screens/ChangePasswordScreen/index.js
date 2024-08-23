import React, { useContext } from 'react'
import { Alert, SafeAreaView, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomHeaderView from '../../components/CustomHeaderView'
import { images } from '../../constants'
import { LocalesMessages } from '../../constants/locales'
import styles from './styles'
import AppButton from '../../components/AppButton'
import AppTextInput from '../../components/AppTextInput'
import { LocalizationContext } from '../../context/LocalizationContext'
import { useNavigation } from '@react-navigation/native'
import useScreenTracking from '../../hooks/screenTracking'
import jwt_decode from "jwt-decode"
import { Formik } from "formik";
import * as Yup from "yup";
import authApi from "../../api/auth";
import useApi from "../../hooks/useApi";
import AuthContext from "../../contexts/auth";
import authStorage from "../../utilities/authStorage";
import { useTheme, Text, Icon } from "@ui-kitten/components";
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

const ChangePasswordScreen = () => {
  const navigation = useNavigation()
  const updateUserInfoApi = useApi(authApi.updateUserInfo);

  const authContext = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  //const toast = useToast();

  const theme = useTheme();
  const [isOldPasswordFlow, setIsOldPasswordFlow] = React.useState(true)
  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [passwordError, setPasswordError] = React.useState('');
  const [currentPasswordError,setCurrentPasswordError] = React.useState('');
  // useScreenTracking(navigation, Route.ChangePasswordScreen)
  const onPressButton = () => {
    if (isOldPasswordFlow) {
      setIsOldPasswordFlow(false)
      setCurrentPasswordError('')
      setNewPassword('');
      setConfirmPassword('');
      
     
    } else {

      console.log("CurrentPassword",currentPassword);
      if (newPassword !== confirmPassword) {
        setPasswordError("Les mots de passe ne correspondent pas");
        return;
      }
      
      // Effacer l'erreur si la validation réussit
      setPasswordError('');
      saveHandler({
        _id: userProfile._id,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        currentPassword: currentPassword,
        newPassword: newPassword,
      });
      
    }
  }
  const userProfile = {
    profilePicture:"person",
    _id: user ? user._id : null,
    userName:user ? user.userName : null,
    firstName: user ? user.firstName : null,
    lastName: user ? user.lastName : null,
    email: user ? user.email : null,
  };
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
     setIsOldPasswordFlow(true)
     setCurrentPasswordError("Le mot de passe actuel est incorrect. Veuillez réessayer.")
      return;
    } else{
      
      const options = [
        {
          text: LocalesMessages.OK,
          onPress: () => {
            navigation.goBack()
          },
        },
      ]
      Alert.alert('', LocalesMessages.yourPasswordHasBeenSuccessfullyChanged, options)
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
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.mainContainer]}>
          <CustomHeaderView
            leftButtonImage={images.backButton}
            title={LocalesMessages.changePassword}
            leftButtonOnPress={() => {
              navigation.goBack()
            }}
            isFromProfileMenu={true}
          />
          <View style={styles.bodyContainer}>
            {isOldPasswordFlow ? (
              <AppTextInput
                labelTitle={LocalesMessages.yourPassword}
                placeholderText={LocalesMessages.enterYourCurrentPassword}
                isForPassword={true}
                value={currentPassword}
                onChangeText={text => {
                  setCurrentPassword(text)
                }}
              />
              
            ) : (
              <>
                <AppTextInput
                  labelTitle={LocalesMessages.yourNewPassword}
                  placeholderText={LocalesMessages.enterYourNewPassword}
                  isForPassword={true}
                  value={newPassword}
                  onChangeText={text => {
                    setNewPassword(text)
                  }}
                />
                <AppTextInput
                  labelTitle={LocalesMessages.confirmPassword}
                  placeholderText={LocalesMessages.confirmYourNewPassword}
                  isForPassword={true}
                  value={confirmPassword}
                  onChangeText={text => {
                    setConfirmPassword(text)
                  }}
                />
                {passwordError ? (
                  <Text style={{ color: 'red', marginTop: 5 }}>{passwordError}</Text>
                ) : null}
              </>
            )}
            {currentPasswordError ? (
                  <Text style={{ color: 'red', marginTop: 5 }}>{currentPasswordError}</Text>
                ) : null}
          </View>
          <AppButton
            localizedText={isOldPasswordFlow ? LocalesMessages.continue : LocalesMessages.confirm}
            buttonStyle={styles.confirmButton}
            labelStyle={[styles.confirmButtonText, styles.fontWeight500]}
            isDisable={
              (isOldPasswordFlow && currentPassword.length == 0) ||
              (!isOldPasswordFlow && (newPassword.length == 0 || confirmPassword.length == 0))
            }
            onPress={onPressButton}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default ChangePasswordScreen;
