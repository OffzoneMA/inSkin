import React from 'react'
import { ActivityIndicator, TouchableOpacity } from 'react-native'
import AppText from '../AppText'
import { styles } from './styles'
import { colors } from '../../constants'

const AppButton = (props) => {
  const {
    label,
    localizedText = {},
    buttonStyle,
    isDisable = false,
    isLoading = false,
    labelStyle,
    isFollow = false,
    onPress,
    textColor = colors.white, // Default text color
    backgroundColor = colors.pink, // Default background color
  } = props

  return (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress()
      }}
      disabled={isDisable || isLoading}
      activeOpacity={0.8}
      style={[
        styles.appButtonContainer,
        buttonStyle,
        {
          backgroundColor: isFollow
            ? colors.categoryOptionSelected
            : colors.pink, // Fixed background color assignment
          opacity: isDisable ? 0.4 : 1,
        },
      ]}>
      {!isDisable && isLoading ? (
        <ActivityIndicator size={'small'} color={colors.white} />
      ) : (
        <AppText
          size='font14px'
          text={localizedText}
          fontFamily='semiBold'
          style={[
            styles.appButtonLabelText,
            labelStyle,
            { color: textColor }, // Customizable text color
          ]}>
          {label}
        </AppText>
      )}
    </TouchableOpacity>
  )
}

export default AppButton;
