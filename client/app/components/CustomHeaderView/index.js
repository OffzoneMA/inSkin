import { Image, TouchableOpacity, View } from 'react-native'
import React from 'react'
import AppIconButton from '../AppIconButton'
import AppText from '../AppText'
import styles from './styles'
import { colors, images } from '../../constants'

const CustomHeaderView = ({
  title,
  titleStyle,
  leftButtonImage,
  leftImageStyle,
  leftImageContainerStyle,
  leftImageTouchContainerStyle,
  leftButtonOnPress,
  rightButtonImage,
  rightImageStyle,
  rightImageContainerStyle,
  rightImageTouchContainerStyle,
  rightButtonOnPress,
  isFromProfileMenu,
  isFromNotificationHeader,
}) => {
  return (
    <View
      style={[
        styles.mainContainer,
        {
          justifyContent:
            (rightButtonImage && leftButtonImage) ||
            (title && rightButtonImage) ||
            (title && leftButtonImage)
              ? 'space-between'
              : 'flex-end',
        },
      ]}>
      {leftButtonImage && leftButtonOnPress ? (
        <AppIconButton
          imageSource={leftButtonImage}
          imageStyle={leftImageStyle}
          imageContainerStyle={leftImageContainerStyle}
          imageTouchContainerStyle={leftImageTouchContainerStyle}
          onPress={leftButtonOnPress}
        />
      ) : (
        <View style={styles.blankView} />
      )}
      {title ? (
        <AppText localizedText={title} fontFamily='medium' style={[styles.titleText, titleStyle]} />
      ) : (
        <></>
      )}
      {rightButtonImage && rightButtonOnPress ? (
        <>
          <AppIconButton
            imageSource={rightButtonImage}
            imageStyle={rightImageStyle}
            imageContainerStyle={rightImageContainerStyle}
            imageTouchContainerStyle={rightImageTouchContainerStyle}
            onPress={rightButtonOnPress}
          />
          {isFromNotificationHeader ? <View style={styles.notificationBadge} /> : <></>}
        </>
      ) : isFromProfileMenu ? (
        <TouchableOpacity style={styles.languageTouchContainer}>
          <View style={styles.languageContainer}>
            <AppText text='FRN' size='font12px' color={colors.tabBarGray} />
            <Image source={images.arrowIcon} style={styles.arrowImage} />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.blankView} />
      )}
    </View>
  )
}

export default CustomHeaderView
