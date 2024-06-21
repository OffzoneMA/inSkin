import React from 'react'
import { SafeAreaView, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import CustomHeaderView from '../../components/CustomHeaderView'
import { images } from '../../constants'
import { LocalesMessages } from '../../constants/locales'
import styles from './styles'
import { Route, notificationOptions } from '../../constants/constants'
import ProfileOptionView from '../../components/ProfileOptionView'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { selectNotificationSettings } from '../../redux/selector/appSelectors'
import { useAppDispatch } from '../../redux/store'
import { updateNotificationSetting } from '../../redux/slices/app/appSlice'

const NotificationOptionsScreen = () => {
  const navigation = useNavigation()
  const notificationSettingOptions = useSelector(selectNotificationSettings)
  const dispatch = useAppDispatch()

  const getSwitchValue = index => {
    if (index == 1) {
      return notificationSettingOptions.sms
    }
    if (index == 2) {
      return notificationSettingOptions.email
    }
    if (index == 3) {
      return notificationSettingOptions.whenPeopleFollow
    }
    if (index == 4) {
      return notificationSettingOptions.whenNewProductAdd
    }
    if (index == 5) {
      return notificationSettingOptions.whenBestProductAdd
    }
    return false
  }
  const updateNotificationValue = (index, value) => {
    let updatedSetting = { ...notificationSettingOptions }

    switch (index) {
      case 1:
        updatedSetting.sms = value
        break
      case 2:
        updatedSetting.email = value
        break
      case 3:
        updatedSetting.whenPeopleFollow = value
        break
      case 4:
        updatedSetting.whenNewProductAdd = value
        break
      case 5:
        updatedSetting.whenBestProductAdd = value
        break
      default:
        break
    }

    dispatch(updateNotificationSetting(updatedSetting))
  }

  const setSwitchValue = (index, value) => {
    updateNotificationValue(index, value)
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.mainContainer]}>
          <CustomHeaderView
            leftButtonImage={images.backButton}
            title={LocalesMessages.notifications}
            leftButtonOnPress={() => {
              navigation.goBack()
            }}
            isFromProfileMenu={true}
          />
          <View style={styles.bodyContainer}>
            {notificationOptions.map((item, index) => {
              return (
                <ProfileOptionView
                  key={index}
                  titleTextStyle={styles.optionTitleText}
                  titleText={item.titleText}
                  rightImageSource={
                    item.titleText == LocalesMessages.Push ? images.arrowIcon : undefined
                  }
                  isPushOption={item.titleText == LocalesMessages.Push}
                  isSwitchOption={item.titleText != LocalesMessages.Push}
                  rightButtonPushStatusText={
                    item.titleText == LocalesMessages.Push
                      ? notificationSettingOptions.push
                        ? LocalesMessages.Enabled
                        : LocalesMessages.Disabled
                      : undefined
                  }
                  rightImageStyle={styles.optionArrowImage}
                  isSwitchEnable={getSwitchValue(index)}
                  toggleSwitch={value => {
                    setSwitchValue(index, value)
                  }}
                  onPress={() => {
                    if (index == 0) {
                      navigation.navigate(Route.PushNotificationScreen)
                    }
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

export default NotificationOptionsScreen;
