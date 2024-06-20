import { StyleSheet } from 'react-native'
import { deviceWidth } from '../../constants/constants'

const styles = StyleSheet.create({
  mainContainer: {
    width: deviceWidth / 2 - 20,
    paddingBottom: 24,
  },
  descText: {
    marginTop: 4,
  },
  ratingReviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  productImageContainer: {
    marginTop: 8,
  },
  ratingCntText: {
    marginLeft: 9
  },
  reviewTotalCntText: {
    marginLeft: 3
  },
  productImage: {
    resizeMode: 'cover',
    height: 190,
    width: '100%',
    borderRadius: 10,
  },
  optionButtonContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    position: 'absolute',
    right: 4,
    top: 9,
  },
  optionImage: {
    width: 3,
    height: 16,
  },
  titleDescContainer: {
    marginTop: 8,
  },
  ratingStarImage: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
  },
})
export default styles
