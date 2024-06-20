import React from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import data from '../../../data/homeCarouselData.json'
import AppButton from '../AppButton'
import AppText from '../AppText'
import { styles } from './styles'
import { images } from '../../constants'

const HomeCarousel = ({ onFollowButtonPress }) => {
  const renderSliderItem = (item) => {
    return (
      <View style={styles.slideMainContainer}>
        <View style={styles.slideContainer}>
          <TouchableOpacity activeOpacity={0.6}>
            <Image source={images.close} style={styles.closeIcon} />
          </TouchableOpacity>
          <Image
            source={images.homeCarouselAvatar}
            style={styles.userAvatar}
            resizeMode='contain'
          />
          <AppText text={item.name} fontFamily='medium' style={styles.userName} size='font18px' />
          <View style={styles.productImagesContainer}>
            <Image source={images.homeProductImage1} style={styles.productImage} />
            <Image source={images.homeProductImage2} style={styles.productImage} />
            <Image
              source={images.homeProductImage3}
              style={[styles.productImage, { marginRight: 0 }]}
            />
          </View>
          <AppButton
            label='Follow'
            buttonStyle={styles.followButton}
            onPress={() => onFollowButtonPress && onFollowButtonPress()}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.mainContainer}>
      <Carousel
        layout={'default'}
        data={data.carouselData ?? []}
        renderItem={({ item }) => renderSliderItem(item)}
        sliderWidth={500}
        itemWidth={310}
        hasParallaxImages={true}
      />
    </View>
  )
}

export default HomeCarousel
