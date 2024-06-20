import React from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import CustomHeaderView from '../../components/CustomHeaderView'
import { images } from '../../constants'
import styles from './styles'
import { LocalesMessages } from '../../constants/locales'
import WebView from 'react-native-webview'
import { Route, termsHTMLContent } from '../../constants/constants'
import { useNavigation } from '@react-navigation/native'
import useScreenTracking from '../../hooks/screenTracking'

const WebViewScreen = ({ title = LocalesMessages.termsOfUse, htmlContent = termsHTMLContent }) => {
  const navigation = useNavigation()
  useScreenTracking(navigation, Route.WebViewScreen)
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        <CustomHeaderView
          leftButtonImage={images.backArrow}
          leftImageStyle={styles.leftImage}
          leftImageTouchContainerStyle={styles.headerButtonContainer}
          rightButtonImage={images.close}
          rightImageStyle={styles.rightImage}
          rightImageTouchContainerStyle={styles.headerButtonContainer}
          title={title}
          titleStyle={styles.headerTitle}
          leftButtonOnPress={() => {
            navigation.goBack()
          }}
          rightButtonOnPress={() => {}}
          isFromLegalInfo={true}
        />
      </View>
      <View style={styles.divider} />
      <WebView
        source={{
          html: htmlContent,
        }}
      />
    </SafeAreaView>
  )
}

export default WebViewScreen
