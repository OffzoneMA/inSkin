import React from 'react'
import { Image, View } from 'react-native'
import AppButton from '../AppButton'
import AppText from '../AppText'
import styles from './styles'
import { colors, images } from '../../constants'
import { LocalesMessages } from '../../constants/locales'

const ProductListEmptyView = ({
  fromrecherche,
  fromAjoutProduit,
  onPressScanProduct,
  emptyMessage,
  mainContainerStyle,
  buttonTitle = LocalesMessages.scanProduct,
  buttonStyle,
  messageempty=LocalesMessages.oops
}) => {
  return (
    <View style={[styles.mainContainer, mainContainerStyle]}>
      <Image source={fromAjoutProduit ? images.emogic : images.noDataSymbol} style={styles.symbolImage} />
      
      <AppText
        text={messageempty}
        size='font20px'
        fontFamily='medium'
        color={colors.lightBlackSecondary}
        style={styles.oopsText}
      />
      {fromAjoutProduit ? (
        <View style={styles.centeredTextContainer}>
          
          <AppText
            text="Veuillez noter que l'ajout de ce produit sera géré et"
            size="font12px"
            color={colors.tabBarGray}
            style={[styles.oopsText, { textAlign: 'center', marginBottom: 10 }]} // Centré avec espace après
          />
          <AppText
            text=" validé par l'administrateur."
            size="font12px"
            color={colors.tabBarGray}
            style={[styles.oopsText, { textAlign: 'center', marginBottom: 10 }]} // Centré avec espace après
          />
          <AppText
            text="Nous vous remercions d'avoir ajouté ce produit."
            size="font12px"
            color={colors.tabBarGray}
            style={[styles.oopsText, { textAlign: 'center', marginBottom: 10 }]} // Centré avec espace après
          />
          <AppText
            text="Profitez pleinement de l'application."
            size="font12px"
            color={colors.tabBarGray}
            style={{ textAlign: 'center' }} // Centré, dernier élément
          />
        </View> ):( <AppText
        text={emptyMessage}
        size='font12px'
        color={colors.tabBarGray}
        style={styles.oopsText}
      />) }
      
      {!fromAjoutProduit && !fromrecherche && (
      <AppButton
        localizedText={buttonTitle}
        buttonStyle={[styles.scanProductButton, buttonStyle]}
        onPress={onPressScanProduct}
      />
      )}
    </View>
  )
}

export default ProductListEmptyView;
