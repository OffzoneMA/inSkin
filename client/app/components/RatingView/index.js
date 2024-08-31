import React from 'react'
import { View, Image, ImageStyle } from 'react-native'
import { styles } from './styles'
import { images } from '../../constants'

const STAR = {
  fill: images.starFill,
  unFill: images.starUnFill,
}

const RenderRating = ({ rating, style }) => {
  const ratings = [1, 2, 3, 4, 5]
  const rateCount = Math.ceil(rating)
  const getImage = (obj) => {
    if (obj <= rateCount) {
      if (obj <= rating) {
        return STAR.fill
      }
    }
    return STAR.unFill
  }
  return (
    <View style={{ flexDirection: 'row' }}>
      {ratings.map(obj => {
        return (
          <Image key={obj} style={[styles.starImage, style]} source={getImage(obj)} resizeMode='contain' />
        )
      })}
    </View>
  )
}

const RatingView = ({ rating , startImageStyle}) => {
  return <RenderRating rating={rating} style={startImageStyle}/>
}

export default RatingView
