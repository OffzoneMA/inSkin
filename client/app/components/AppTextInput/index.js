import { Image, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import AppText from '../AppText'
import { colors, images } from '../../constants'
import styles from './styles'
import { LocalizationContext } from '../../contexts/LocalizationContext'

const AppTextInput = ({
  mainContainerStyle,
  leftImageSource,
  leftImageStyle,
  isPhoneNumber,
  placeholderText,
  labelTitle,
  labelTitleStyle,
  textInputStyle,
  value,
  onPressCountryCode,
  onChangeText,
  isForPassword,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [isShowPassword, setIsShowPassword] = React.useState(true);
  const { translate } = useContext(LocalizationContext);
  const onPressShowHidePassword = () => {
    setIsShowPassword(!isShowPassword)
  }
  return (
    <View style={[{ marginVertical: 10 }, mainContainerStyle]}>
      {labelTitle ? (
        <AppText
          localizedText={labelTitle}
          size='font14px'
          fontFamily='medium'
          color={colors.lightBlackSecondary}
          style={[styles.titleText, labelTitleStyle]}
        />
      ) : (
        <></>
      )}
      <View
        style={[
          styles.mainBorderContainer,
          {
            borderColor: isFocused ? colors.inputFocusBorderShadow : colors.white,
          },
        ]}>
        <View
          style={[
            styles.borderContainer,
            {
              borderColor: isFocused ? colors.inputFocusBorder : colors.inputBorder,
            },
          ]}>
          {leftImageSource ? (
            <Image source={leftImageSource} style={[styles.leftImage, leftImageStyle]} />
          ) : (
            <></>
          )}
          {isPhoneNumber ? (
            <TouchableOpacity onPress={onPressCountryCode}>
              <View style={styles.countryCodeContainer}>
                <AppText
                  text='US'
                  size='font16px'
                  color={colors.countryCodeColor}
                />
                <Image source={images.arrowIcon} style={styles.arrowImage} />
              </View>
            </TouchableOpacity>
          ) : (
            <></>
          )}
          <TextInput
            value={value}
            style={[styles.textInput, { marginLeft: leftImageSource ? 8 : 0 }, textInputStyle]}
            placeholder={placeholderText ? translate(placeholderText) : ''}
            placeholderTextColor={colors.lightGray}
            secureTextEntry={isForPassword && isShowPassword}
            keyboardType={isPhoneNumber ? 'phone-pad' : 'default'}
            onFocus={() => {
              setIsFocused(true)
            }}
            onBlur={() => {
              setIsFocused(false)
            }}
            onChangeText={onChangeText}
          />
          {isForPassword ? (
            <TouchableOpacity onPress={onPressShowHidePassword}>
              <View style={styles.passwordButtonContainer}>
                <Image
                  source={isShowPassword ? images.eyeOff : images.eye}
                  style={styles.passwordImage}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </View>
    </View>
  )
}

export default AppTextInput