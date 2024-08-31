import { Image, TextInput, TouchableOpacity, View, Text } from 'react-native';
import React, { useContext } from 'react';
import AppText from '../AppText';
import { colors, images } from '../../constants';
import styles from './styles';
import { LocalizationContext } from '../../contexts/LocalizationContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
  errorMessage,  // Ajout de la prop pour le message d'erreur
  errorVisible,  // Ajout de la prop pour la visibilité de l'erreur
  onFocus,
  onBlur
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [isShowPassword, setIsShowPassword] = React.useState(true);
  const { translate } = useContext(LocalizationContext);

  const onPressShowHidePassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <View style={[{ marginVertical: 10 }, mainContainerStyle]}>
      {labelTitle ? (
        <AppText
          text={labelTitle}
          size='font14px'
          fontFamily='medium'
          color={colors.lightBlackSecondary}
          style={[styles.titleText, labelTitleStyle]}
        />
      ) : null}

      <View
        style={[
          styles.mainBorderContainer,
          {
            borderColor: isFocused ? colors.inputFocusBorderShadow : colors.white,
          },
        ]}
      >
        <View
          style={[
            styles.borderContainer,
            {
              borderColor: isFocused ? colors.inputFocusBorder : colors.inputBorder,
            },
          ]}
        >
          {leftImageSource ? (
            <Image source={leftImageSource} style={[styles.leftImage, leftImageStyle]} />
          ) : null}

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
          ) : null}

          <TextInput
            value={value}
            style={[styles.textInput, { marginLeft: leftImageSource ? 8 : 0 }, textInputStyle]}
            placeholder={placeholderText}
            placeholderTextColor={colors.lightGray}
            secureTextEntry={isForPassword && isShowPassword}
            keyboardType={isPhoneNumber ? 'phone-pad' : 'default'}
            onFocus={() => {
              setIsFocused(true);
              if (onFocus) onFocus();
            }}
            onBlur={() => {
              setIsFocused(false);
              if (onBlur) onBlur();
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
          ) : null}
          {errorVisible && (
            <View style={styles.errorIconContainer}>
              <FontAwesome name="exclamation-circle" color="red" size={24} />
            </View>
          )}
        </View>
      </View>

      {errorVisible && errorMessage ? (
        <Text style={{ color: 'red', marginTop: 5 }}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};

export default AppTextInput;
