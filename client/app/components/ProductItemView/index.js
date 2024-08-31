import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import AppIconButton from '../AppIconButton'
import AppText from '../AppText'
import styles from './styles'
import { colors, images } from '../../constants'
import RatingView from '../RatingView'

const ProductItemView = ({ index, item, item1, onPressOption, isFromFavoriteList,averageRating, onPressItem}) => {
 
    
  const imageSource = item.images && item.images.length > 0  
  ? { uri: `data:${item.images[0].contentType};base64,${item.images[0].data}` }
  : null;
  const formattedDate = new Date(item.createdAt).toLocaleDateString('CA-CA');
  return (
    <TouchableOpacity onPress={onPressItem}>
      <View
        style={[
          styles.mainContainer,
          {
            paddingRight: index % 2 == 0 ? 10 : 0,
            paddingLeft: index % 2 == 0 ? 0 : 10,
          },
        ]}>
        {!isFromFavoriteList ? (
          <AppText size='font12px' color={colors.tabBarGray}>
            {formattedDate}
          </AppText>
        ) : (
          <></>
        )}
        <View style={styles.productImageContainer}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.productImage}
          />
        ) : (
          <Image source={images.homeCarouselAvatar} style={styles.productImage} /> // Message à afficher si aucune image n'est disponible
        )}
          
          <AppIconButton
            imageSource={images.optionsIcon}
            imageTouchContainerStyle={styles.optionButtonContainer}
            imageStyle={styles.optionImage}
            onPress={onPressOption}
          />
        </View>
        <View style={styles.titleDescContainer}>
          <AppText size='font16px' color={colors.lightBlack} fontFamily='medium'>
            {isFromFavoriteList ? item.category: item.productName}
          </AppText>
          {!isFromFavoriteList ? (
            <AppText
              numberOfLines={2}
              color={colors.tabBarGray}
              size='font12px'
              style={styles.descText}>
             {item.productDescription}
            </AppText>
          ) : (
            <></>
          )}
        </View>
        {!isFromFavoriteList ? (
          <View style={styles.ratingReviewContainer}>
            {item.comment ? (
              <>
              
                <RatingView rating={averageRating} startImageStyle={styles.ratingStarImage} />
                <AppText
                  size='font14px'
                  color={colors.lightBlackSecondary}
                  style={[styles.ratingCntText]}>
                  {item.rating}
                </AppText>
              </>
            ) : (
              <></>
            )}
            {item.ratingsCount ? (
              <AppText size='font12px' color={colors.lightGray} style={[styles.reviewTotalCntText]}>
                {`(${item.ratingsCount})`}
              </AppText>
            ) : (
              <></>
            )}
          </View>
        ) : (
          <></>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default ProductItemView
