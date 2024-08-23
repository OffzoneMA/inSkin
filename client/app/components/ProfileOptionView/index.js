import { Image, Switch, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '../../constants'
import AppText from '../AppText'
import styles from './styles'

const ProfileOptionView = props => {
  const {
    mainContainerStyle,
    leftImageTitleContainerStyle,
    leftImageSource,
    leftImageStyle,
    titleText,
    titleTextStyle,
    descText,
    descTextStyle,
    rightImageSource,
    rightImageStyle,
    dividerStyle,
    isHideDivider,
    onPress,
    isFromSocialLink,
    isPushOption,
    rightButtonPushStatusText,
    rightButtonPushStatusTextStyle,
    isSwitchOption,
    isSwitchEnable,
    toggleSwitch
  } = props
  return (
    <TouchableOpacity style={styles.touchContainer} disabled={isSwitchOption} onPress={onPress}>
      <View style={[styles.mainContainer, mainContainerStyle]}>
        <View style={[styles.leftImageTitleContainer, leftImageTitleContainerStyle]}>
          {leftImageSource ? (
            <Image source={leftImageSource} style={[styles.leftImage, leftImageStyle]} />
          ) : (
            <></>
          )}
          <View
            style={[
              styles.titleDescContainer,
              isSwitchOption && titleText.length > 20 && { width: '80%' },
            ]}>
            {titleText ? (
              <AppText
                text={titleText}
                size='font16px'
                fontFamily='medium'
                color={colors.lightBlackSecondary}
                numberOfLines={2}
                style={[titleTextStyle]}
              />
            ) : (
              <></>
            )}
            {descText ? (
              <AppText
                text={!isFromSocialLink ? descText : ''}
                
                size='font12px'
                color={colors.tabBarGray}
                style={[styles.descText, descTextStyle]}
              />
            ) : (
              <></>
            )}
          </View>
        </View>
        {rightImageSource ? (
          <View style={styles.rightImageContainer}>
            {isPushOption && rightButtonPushStatusText ? (
              <AppText
                localizedText={rightButtonPushStatusText}
                size='font12px'
                color={colors.tabBarGray}
                style={[styles.rightPushOptionText, rightButtonPushStatusTextStyle]}
              />
            ) : (
              <></>
            )}
            <Image source={rightImageSource} style={[styles.rightImage, rightImageStyle]} />
          </View>
        ) : (
          <></>
        )}
        {isSwitchOption ? <Switch onValueChange={toggleSwitch} value={isSwitchEnable} /> : <></>}
      </View>
      {!isHideDivider ? <View style={[styles.dividerLine, dividerStyle]} /> : <></>}
    </TouchableOpacity>
  )
}

export default ProfileOptionView
