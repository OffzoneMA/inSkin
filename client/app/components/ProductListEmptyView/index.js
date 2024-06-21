import React from 'react'
import { Image, View } from 'react-native'
import AppButton from '../AppButton'
import AppText from '../AppText'
import styles from './styles'
import { colors, images } from '../../constants'
import { LocalesMessages } from '../../constants/locales'

const ProductListEmptyView = ({
  onPressScanProduct,
  emptyMessage,
  mainContainerStyle,
  buttonTitle = LocalesMessages.scanProduct,
  buttonStyle
}) => {
  return (
    <View style={[styles.mainContainer, mainContainerStyle]}>
      <Image source={images.noDataSymbol} style={styles.symbolImage} />
      <AppText
        localizedText={LocalesMessages.oops}
        size='font20px'
        fontFamily='medium'
        color={colors.lightBlackSecondary}
        style={styles.oopsText}
      />
      <AppText
        localizedText={emptyMessage}
        size='font12px'
        color={colors.tabBarGray}
        style={styles.oopsText}
      />
      <AppButton
        localizedText={buttonTitle}
        buttonStyle={[styles.scanProductButton, buttonStyle]}
        onPress={onPressScanProduct}
      />
    </View>
  )
}

export default ProductListEmptyView;
