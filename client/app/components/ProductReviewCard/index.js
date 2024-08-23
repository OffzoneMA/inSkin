import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { deviceWidth } from '../../constants/constants'
import { colors, images } from '../../constants'
import AppText from '../AppText'
import { styles } from './styles'

const ProductReviewCard = ({ item }) => {
  return (
    <View style={styles.reviewContainer}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Image source={images.homeCarouselAvatar} style={styles.reviewerImage} />
        <View
          style={{
            marginLeft: 13,
          }}>
          <AppText
            text={item.name}
            style={styles.reviewerName}
            size={'font14px'}
            fontFamily='medium'
          />
          <AppText text={item.date} style={styles.reviewDateText} size={'font14px'} />
        </View>
      </View>
      
      <AppText text={item.comment} style={styles.reviewText} numberOfLines={5} size={'font14px'} />
      <View style={styles.reviewLikeUnLikeContainer}>
        <TouchableOpacity>
          <Image source={images.upTriangle} style={styles.reviewLikeImage} />
        </TouchableOpacity>
        <AppText text='12k' size='font12px' style={styles.reviewCountText} />
        <TouchableOpacity>
          <Image
            source={images.upTriangle}
            style={[
              styles.reviewLikeImage,
              {
                marginLeft: 5,
                transform: [{ rotate: '180deg' }],
                opacity: 0.8,
              },
            ]}
          />
        </TouchableOpacity>
        <AppText text='8k' size='font12px' style={styles.reviewCountText} />
      </View>
    </View>
  )
}

export default ProductReviewCard
