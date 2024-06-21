import React from 'react'
import { SafeAreaView, View } from 'react-native'
import CustomHeaderView from '../../components/CustomHeaderView'
import { images } from '../../constants'
import { LocalesMessages } from '../../constants/locales'
import styles from './styles'
import ProfileOptionView from '../../components/ProfileOptionView'
import { useNavigation } from '@react-navigation/native'
import { Route } from '../../constants/constants'
import useScreenTracking from '../../hooks/screenTracking'

const LegalInfoScreen = () => {
  const navigation = useNavigation()
  useScreenTracking(navigation, Route.LegalInfoScreen)
  const onPressTermsOfUse = () => {
    navigation.navigate(Route.WebViewScreen)
  }
  const onPressLegalNotice = () => {
    navigation.navigate(Route.WebViewScreen)
  }
  const onPressPrivacyPolicy = () => {
    navigation.navigate(Route.WebViewScreen)
  }
  const onPressCookiePolicy = () => {
    navigation.navigate(Route.WebViewScreen)
  }
  const logalInfoOptions = [
    {
      title: LocalesMessages.termsOfUse,
      onPress: onPressTermsOfUse,
    },
    {
      title: LocalesMessages.legalNotice,
      onPress: onPressLegalNotice,
    },
    {
      title: LocalesMessages.privacyPolicy,
      onPress: onPressPrivacyPolicy,
    },
    {
      title: LocalesMessages.cookiePolicy,
      onPress: onPressCookiePolicy,
    },
  ]
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <CustomHeaderView
          leftButtonImage={images.backArrow}
          leftImageStyle={styles.leftImage}
          leftImageTouchContainerStyle={styles.headerButtonContainer}
          rightButtonImage={images.share}
          rightImageStyle={styles.rightImage}
          rightImageTouchContainerStyle={styles.headerButtonContainer}
          title={LocalesMessages.legalInformation}
          titleStyle={{ textAlign: 'flex-start', paddingLeft: 14 }}
          leftButtonOnPress={() => {
            navigation.goBack()
          }}
          rightButtonOnPress={() => {}}
          isFromLegalInfo={true}
        />
      </View>
      <View style={styles.divider} />
      <View style={styles.mainMenuContainer}>
        {logalInfoOptions.map((item, index) => {
          return <ProfileOptionView key={index} titleText={item.title} onPress={item.onPress} />
        })}
      </View>
    </SafeAreaView>
  )
}

export default LegalInfoScreen;
