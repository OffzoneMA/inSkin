import React, { useContext } from 'react'
import { Alert, SafeAreaView, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomHeaderView from '../../components/CustomHeaderView'
import { colors, images } from '../../constants'
import { LocalesMessages } from '../../constants/locales'
import styles from './styles'
import ProfileOptionView from '../../components/ProfileOptionView'
import { LocalizationContext } from '../../contexts/LocalizationContext'
import { Route, settingOptions } from '../../constants/constants'
import { useNavigation } from '@react-navigation/native'

const SettingScreen = () => {
  const navigation = useNavigation()
  const { translate } = useContext(LocalizationContext)
  const onPressChangePassword = () => {
    navigation.navigate(Route.ChangePasswordScreen)
  }
  const onPressSupport = () => {
    navigation.navigate(Route.SupportScreen)
  }
  const onPressRateTheAppOnStore = () => {}
  const onPressTermsOfService = () => {}
  const onPressNotifications = () => {
    navigation.navigate(Route.NotificationOptionsScreen)
  }
  const onPressDeactiveAccount = () => {
    const options = [
      { text: translate(LocalesMessages.cancel) },
      { text: translate(LocalesMessages.confirm), style: 'destructive', onPress: () => {} },
    ]
    Alert.alert('', translate(LocalesMessages.areYouSureYouWantDeleteYourAccount), options)
  }
  const onPressOption = index => {
    if (index == 0) {
      onPressChangePassword()
    } else if (index == 1) {
      onPressSupport()
    } else if (index == 2) {
      onPressRateTheAppOnStore()
    } else if (index == 3) {
      onPressTermsOfService()
    } else if (index == 4) {
      onPressNotifications()
    } else if (index == 5) {
      onPressDeactiveAccount()
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
            title={LocalesMessages.settings}
            leftButtonOnPress={() => {
              navigation.goBack()
            }}
            isFromProfileMenu={true}
          />
          <View style={styles.bodyContainer}>
            {settingOptions.map((item, index) => {
              return (
                <ProfileOptionView
                  key={index}
                  titleTextStyle={[
                    styles.optionTitleText,
                    item.titleText == LocalesMessages.deactivateAccount && { color: colors.pink },
                  ]}
                  titleText={item.titleText}
                  rightImageSource={
                    item.titleText != LocalesMessages.deactivateAccount
                      ? images.arrowIcon
                      : undefined
                  }
                  rightImageStyle={styles.optionArrowImage}
                  onPress={() => {
                    onPressOption(index)
                  }}
                />
              )
            })}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default SettingScreen
