import React from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import CustomHeaderView from '../../components/CustomHeaderView'
import { images } from '../../constants'
import { LocalesMessages } from '../../constants/locales'
import styles from './styles'
import ProfileOptionView from '../../components/ProfileOptionView'
import AppTextInput from '../../components/AppTextInput'
import AppButton from '../../components/AppButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { selectSocialMediaLinks } from '../../redux/selector/appSelectors'
import { useAppDispatch } from '../../redux/store'
import { updateSocialMediaLink } from '../../redux/slices/app/appSlice'
import useScreenTracking from '../../hooks/screenTracking'
import { Route } from '../../constants/constants'

const SocialMediaListScreen = () => {
  const navigation = useNavigation()
  const socialMediaLinkSelector = useSelector(selectSocialMediaLinks)
  const dispatch = useAppDispatch()
  const [isTickTokFocus, setIsTickTokFocus] = React.useState(false)
  const [isInstagramFocus, setIsInstagramFocus] = React.useState(false)
  const [tickTokProfileLink, setTickTokProfileLink] = React.useState(
    socialMediaLinkSelector.tickTok,
  )
  const [instaProfileLink, setInstaProfileLink] = React.useState(socialMediaLinkSelector.instagram)
  useScreenTracking(navigation, Route.SocialMediaListScreen)
  const onPressTickTok = () => {
    setIsTickTokFocus(true)
  }
  const onPressInstagram = () => {
    setIsInstagramFocus(true)
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.mainContainer]}>
          <CustomHeaderView
            leftButtonImage={images.backButton}
            title={LocalesMessages.socialMediaProfileSmall}
            leftButtonOnPress={() => {
              navigation.goBack()
            }}
            isFromProfileMenu={true}
          />
          <View style={styles.bodyContainer}>
            <View style={styles.subMainContainer}>
              {!isInstagramFocus ? (
                <ProfileOptionView
                  leftImageSource={images.ticktok}
                  titleText={LocalesMessages.TIkTok}
                  descText={
                    isTickTokFocus
                      ? ''
                      : tickTokProfileLink.length > 0
                      ? tickTokProfileLink
                      : LocalesMessages.enterYourProfileLink
                  }
                  rightImageSource={images.arrowIcon}
                  rightImageStyle={styles.optionArrowImage}
                  isHideDivider={isTickTokFocus}
                  isFromSocialLink={tickTokProfileLink.length > 0}
                  onPress={() => {
                    onPressTickTok()
                  }}
                />
              ) : (
                <></>
              )}
              {!isTickTokFocus ? (
                <ProfileOptionView
                  leftImageSource={images.instagram}
                  titleText={LocalesMessages.Instagram}
                  descText={
                    isInstagramFocus
                      ? ''
                      : instaProfileLink.length > 0
                      ? instaProfileLink
                      : LocalesMessages.enterYourProfileLink
                  }
                  rightImageSource={images.arrowIcon}
                  rightImageStyle={styles.optionArrowImage}
                  isHideDivider={isInstagramFocus}
                  isFromSocialLink={instaProfileLink.length > 0}
                  onPress={() => {
                    onPressInstagram()
                  }}
                />
              ) : (
                <></>
              )}
              {isTickTokFocus || isInstagramFocus ? (
                <AppTextInput
                  mainContainerStyle={styles.textinputMainContainer}
                  placeholderText={LocalesMessages.enterYourProfileLink}
                  value={
                    isTickTokFocus ? tickTokProfileLink : isInstagramFocus ? instaProfileLink : ''
                  }
                  onChangeText={text => {
                    if (isTickTokFocus) {
                      setTickTokProfileLink(text)
                    } else if (isInstagramFocus) {
                      setInstaProfileLink(text)
                    }
                  }}
                />
              ) : (
                <></>
              )}
            </View>
            {isTickTokFocus || isInstagramFocus ? (
              <AppButton
                localizedText={LocalesMessages.confirm}
                buttonStyle={styles.confirmButton}
                labelStyle={[styles.confirmButtonText, styles.fontWeight500]}
                isDisable={
                  (isTickTokFocus && tickTokProfileLink.length == 0) ||
                  (isInstagramFocus && instaProfileLink.length == 0)
                }
                onPress={() => {
                  setIsTickTokFocus(false)
                  setIsInstagramFocus(false)
                  dispatch(
                    updateSocialMediaLink({
                      ...socialMediaLinkSelector,
                      tickTok: tickTokProfileLink,
                      instagram: instaProfileLink,
                    }),
                  )
                }}
              />
            ) : (
              <></>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default SocialMediaListScreen;
