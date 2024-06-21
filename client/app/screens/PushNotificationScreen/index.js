import React from 'react'
import { SafeAreaView, View } from 'react-native'
import styles from './styles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { images } from '../../constants'
import { LocalesMessages } from '../../constants/locales'
import CustomHeaderView from '../../components/CustomHeaderView'
import ProfileOptionView from '../../components/ProfileOptionView'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { selectNotificationSettings } from '../../redux/selector/appSelectors'
import { useAppDispatch } from '../../redux/store'
import { updateNotificationSetting } from '../../redux/slices/app/appSlice'

const PushNotificationScreen = () => {
  const navigation = useNavigation()
  const notificationSettingOptions = useSelector(selectNotificationSettings)
  const dispatch = useAppDispatch()

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.mainContainer]}>
          <CustomHeaderView
            leftButtonImage={images.backButton}
            title={LocalesMessages.pushNotifications}
            leftButtonOnPress={() => {
              navigation.goBack()
            }}
            isFromProfileMenu={true}
          />
          <View style={styles.bodyContainer}>
            <ProfileOptionView
              titleTextStyle={styles.optionTitleText}
              titleText={LocalesMessages.accountActivity}
              isSwitchOption={true}
              isSwitchEnable={notificationSettingOptions.push}
              toggleSwitch={value => {
                dispatch(
                  updateNotificationSetting({
                    ...notificationSettingOptions,
                    push: value,
                  }),
                )
              }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default PushNotificationScreen;
