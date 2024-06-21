import React, { useContext } from 'react'
import { Text } from 'react-native'
import { LocalizationContext } from '../../contexts/LocalizationContext';

import { FountsEnum } from '../../constants/constants';

const AppText = (props) => {
  const { translate } = useContext(LocalizationContext);
  const { localizedText, text, style, size, fontFamily, children, lineThrough, color, ...rest } = props

  // returns the translated text
  const i18Text = localizedText && translate(localizedText)
  const textContentToRender = i18Text || text || children

  const appTextDefaultStyles = [
    size && fontSizeStyles[size],
    lineThrough && { textDecorationLine: 'line-through' },
    color && { color: color },
    /**
     * by default added primary regular font family if we want to change then change externally from the style prop
     * */
    {
      fontFamily: 'regular',
    },
    fontFamily && fontFamilyStyle[fontFamily],
    style,
  ]
  return (
    //@ts-expect-error  due overloading the diff number of styles and props it giving the lint error will resolve in future
    <Text style={appTextDefaultStyles} {...rest}>
      {textContentToRender}
    </Text>
  )
}

/**
 * font size with calculations
 * */
const fontSizeStyles = {
  font42px: { fontSize: 42 },
  font36px: { fontSize: 36 },
  font30px: { fontSize: 30 },
  font24px: { fontSize: 24 },
  font20px: { fontSize: 20 },
  font22px: { fontSize: 22 },
  font18px: { fontSize: 18 },
  font16px: { fontSize: 16 },
  font15px: { fontSize: 15 },
  font14px: { fontSize: 14 },
  font12px: { fontSize: 12 },
  font18px: { fontSize: 18 },
  font10px: { fontSize: 10 },
}
const fontFamilyStyle = {
  regular: { fontFamily: 'regular' },
  medium: { fontFamily: 'medium' },
  semiBold: { fontFamily: 'semiBold' },
  bold: { fontFamily: 'bold' },
  extraBold: { fontFamily: 'extraBold' },
}

export default AppText
