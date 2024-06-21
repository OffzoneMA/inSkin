import React, { useState } from 'react'
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
        phoneNumber: phoneNumber || '',
      }),
    )
    navigation.goBack()
  }
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
              localizedText={LocalesMessages.editConfirmYourPersonalInformation}
              size='font15px'
              fontFamily='medium'
              color={colors.lightBlackSecondary}
            />
            <View style={styles.textInputMainContainer}>
              <AppTextInput
                labelTitle={LocalesMessages.userName}
                value={userName}
                onChangeText={text => {
                  setUserName(text)
                }}
              />
              <AppTextInput
                labelTitle={LocalesMessages.firstName}
                value={firstName}
                onChangeText={text => {
                  setFirstName(text)
                }}
              />
              <AppTextInput
                labelTitle={LocalesMessages.lastName}
                value={lastName}
                onChangeText={text => {
                  setLastName(text)
                }}
              />
              <AppTextInput
                labelTitle={LocalesMessages.emailAddress}
                leftImageSource={images.email}
                value={email}
                onChangeText={text => {
                  setEmail(text)
                }}
              />
              <AppTextInput
                labelTitle={LocalesMessages.phoneNumber}
                isPhoneNumber={true}
                value={phoneNumber}
                onChangeText={text => {
                  setPhoneNumber(text)
                }}
              />
            </View>
            <AppButton
              localizedText={LocalesMessages.confirm}
              buttonStyle={styles.confirmButton}
              labelStyle={[styles.confirmButtonText]}
              onPress={onPressSubmit}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default PersonalDetailScreen;
