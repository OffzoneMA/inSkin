import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import AppIconButton from '../AppIconButton'
import AppText from '../AppText'
import styles from './styles'
import { colors, images } from '../../constants'
import RatingView from '../RatingView'

const ProductItemView = ({ index, item, onPressOption, isFromFavoriteList, onPressItem }) => {
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
            {item.date}
          </AppText>
        ) : (
          <></>
        )}
        <View style={styles.productImageContainer}>
          <Image source={images.productDetailImage} style={styles.productImage}></Image>
          <AppIconButton
            imageSource={images.optionsIcon}
            imageTouchContainerStyle={styles.optionButtonContainer}
            imageStyle={styles.optionImage}
            onPress={onPressOption}
          />
        </View>
        <View style={styles.titleDescContainer}>
          <AppText size='font16px' color={colors.lightBlack} fontFamily='medium'>
            {isFromFavoriteList ? item.favoriteListName : item.productName}
          </AppText>
          {!isFromFavoriteList ? (
            <AppText
              numberOfLines={2}
              color={colors.tabBarGray}
              size='font12px'
              style={styles.descText}>
              {item.productDesc}
            </AppText>
          ) : (
            <></>
          )}
        </View>
        {!isFromFavoriteList ? (
          <View style={styles.ratingReviewContainer}>
            {item.rating ? (
              <>
                <RatingView rating={item.rating} startImageStyle={styles.ratingStarImage} />
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
