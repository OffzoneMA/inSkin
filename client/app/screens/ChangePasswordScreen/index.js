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
import { Route } from '../../constants/constants'

const ChangePasswordScreen = () => {
  const navigation = useNavigation()
  const { translate } = useContext(LocalizationContext)
  const [isOldPasswordFlow, setIsOldPasswordFlow] = React.useState(true)
  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  useScreenTracking(navigation, Route.ChangePasswordScreen)
  const onPressButton = () => {
    if (isOldPasswordFlow) {
      setIsOldPasswordFlow(false)
      setNewPassword('')
      setCurrentPassword('')
    } else {
      const options = [
        {
          text: translate(LocalesMessages.OK),
          onPress: () => {
            navigation.goBack()
          },
        },
      ]
      Alert.alert('', translate(LocalesMessages.yourPasswordHasBeenSuccessfullyChanged), options)
    }
  }
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
              </>
            )}
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
