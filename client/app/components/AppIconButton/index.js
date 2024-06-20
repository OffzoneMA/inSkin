import {
  Image,
  TouchableOpacity,
  View,
} from 'react-native'
import React from 'react'
import styles from './styles'

const AppIconButton = ({
  imageSource,
  imageStyle,
  imageContainerStyle,
  imageTouchContainerStyle,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.iconTouchContainer, imageTouchContainerStyle]}
      onPress={onPress}>
      <View style={[styles.iconImageContainer, imageContainerStyle]}>
        <Image source={imageSource} style={[styles.iconImage, imageStyle]} />
      </View>
    </TouchableOpacity>
  )
}

export default AppIconButton
