import { Image, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Route } from '../../../constants/constants'
import { colors, images } from '../../../constants'
import AppText from '../../../components/AppText'
import RatingView from '../../../components/RatingView'
import { styles } from './styles'
import { LocalesMessages } from '../../../constants/locales'

const HomeProductListView = ({ item, onPressBookMark }) => {
  const navigation = useNavigation()
  return (
    <>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.navigate(Route.FeedDetailScreen)
          }}>
          <Image source={images.productCardImage} style={styles.productImage} />
        </TouchableOpacity>
        <View style={styles.productNameContainer}>
          <View
            style={{
              marginTop: 8,
            }}>
            <AppText
              text={item.productName}
              style={styles.productNameText}
              size='font16px'
              fontFamily='medium'
            />
            <AppText
              localizedText={LocalesMessages.chanel}
              color={colors.tabBarGray}
              style={styles.productChanelText}
              size='font12px'
            />
          </View>
          <View style={styles.productActionButtonContainer}>
            <TouchableOpacity onPress={onPressBookMark}>
              <Image source={images.bookmark} style={[styles.actionButton, { marginRight: 13 }]} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={images.message} style={styles.actionButton} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.productDescContainer}>
          <Image source={images.homeCarouselAvatar} style={styles.commentUserAvatar} />
          <View style={{ marginLeft: 16 }}>
            <View style={{ flexDirection: 'row' }}>
              <AppText
                text={item.comments[0].name}
                style={styles.commentUserNameText}
                size='font12px'
              />
              <AppText
                text={item.comments[0].date}
                style={styles.commentDataText}
                size='font10px'
              />
            </View>
            <RatingView rating={4} startImageStyle={styles.ratingViewContainer} />
          </View>
        </View>
        <AppText text={item.comments[0].comment} size='font12px' style={styles.commentText} />
        <View style={styles.productLikeContainer}>
          <TouchableOpacity>
            <Image source={images.upTriangle} style={styles.productLikeButton} />
          </TouchableOpacity>
          <AppText text='12k' size='font12px' style={styles.productLikeCountText} />
          <TouchableOpacity>
            <Image
              source={images.upTriangle}
              style={[
                styles.productLikeButton,
                { transform: [{ rotate: '180deg' }], opacity: 0.8, marginLeft: 5 },
              ]}
            />
          </TouchableOpacity>
          <AppText text='8k' size='font12px' style={styles.productLikeCountText} />
        </View>
      </View>
      <View style={styles.dividerView} />
    </>
  )
}

export default HomeProductListView;
