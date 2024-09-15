import { Image, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { styles } from './styles'
import { images } from '../../constants'
import { useSelector } from 'react-redux'
import { selectCurrentScreen } from '../../redux/selector/appSelectors'
import { Route } from '../../constants/constants'

const ScanButton = ({ onPressButton }) => {
  const currentScreen = useSelector(selectCurrentScreen)
  console.log('Current Screen:', currentScreen);
  const screensToHideButton = [
    Route.FeedDetailScreen,
    Route.PersonalDetailScreen,
    Route.LegalInfoScreen,
    Route.WebViewScreen,
    Route.SocialMediaListScreen,
    Route.ChangePasswordScreen,
    Route.SupportScreen,
  ]

  if (screensToHideButton.includes(currentScreen)) {
    return <></>
  }

  return (
    <TouchableOpacity onPress={onPressButton}>
      <View style={styles.mainContainer}>
        <Image source={images.scanner} style={styles.scanImage} />
      </View>
    </TouchableOpacity>
  )
}

export default ScanButton
