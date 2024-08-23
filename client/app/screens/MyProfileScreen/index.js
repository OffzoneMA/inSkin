import React, { useContext } from 'react'
import { Alert, SafeAreaView, ScrollView, View } from 'react-native'
import AppText from '../../components/AppText'
import { LocalesMessages } from '../../constants/locales'
import { colors, images } from '../../constants'
import styles from './styles'
import ProfileOptionView from '../../components/ProfileOptionView'
import MyProfileView from './MyProfileView'
import { Route, myProfileOptions } from '../../constants/constants'
import { LocalizationContext } from '../../contexts/LocalizationContext'
import { useNavigation } from '@react-navigation/native'

const MyProfileScreen = () => {
  const navigation = useNavigation()
  const { translate } = useContext(LocalizationContext)
  const onPressPersonalDetail = () => {
    navigation.navigate(Route.PersonalDetailScreen)
  }
  const onPressSocialMediaProfile = () => {
    navigation.navigate(Route.SocialMediaListScreen)
  }
  const onPressNotifications = () => {}
  const onPressSettings = () => {
    navigation.navigate(Route.SettingScreen)
  }
  const onPressLegal = () => {
    navigation.navigate(Route.LegalInfoScreen)
  }
  const onPressLogout = () => {
    const options = [
      { text: translate(LocalesMessages.cancel) },
      { text: translate(LocalesMessages.confirm), style: 'destructive', onPress: () => {} },
    ]
    Alert.alert('', translate(LocalesMessages.areYouSureYouWantLeaveTheApp), options)
  }
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
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <AppText
            text={LocalesMessages.profile}
            size='font20px'
            fontFamily='semiBold'
            color={colors.lightBlack}
          />
          <MyProfileView />
          <View style={styles.mainOptionContainer}>
            {myProfileOptions.map((item, index) => {
              return (
                <ProfileOptionView
                  key={index}
                  leftImageSource={item.leftImage}
                  titleText={item.titleText}
                  descText={item.descText}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MyProfileScreen;
