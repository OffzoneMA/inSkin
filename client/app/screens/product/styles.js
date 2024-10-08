import { StyleSheet } from 'react-native'
import { deviceWidth } from '../../constants/constants'
import { colors } from '../../constants'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  productImage: {
    height: 300,
    width: deviceWidth - 40,
    resizeMode: 'stretch',
    borderRadius: 10,
    marginTop: 32,
  },
  likeCountFont: {
    marginLeft: 5,
    lineHeight: 16,
    color: colors.tabBarGray,
  },
  productRatingContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexRowWithCenterItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbsUpImage: {
    height: 14,
    width: 14,
    resizeMode: 'contain',
  },
  eyeImage: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
    marginLeft: 11,
  },
  productShareImage: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
    marginLeft: 11,
  },
  productName: {
    lineHeight: 24,
  },
  productSubDesc: {
    lineHeight: 15,
    color: colors.tabBarGray,
    marginTop: 3,
  },
  mostRecentText: {
    lineHeight: 15,
    color: colors.tabBarGray,
  },
  arrowIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginLeft: 6,
  },
  textInputStyle: {
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    width: '90%',
    padding: 10,
    borderColor: colors.inputBorder,
    textAlignVertical: 'center',
  },
  sendButtonContainer: {
    height: 50,
    width: 50,
    backgroundColor: colors.pink,
    borderRadius: 8,
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  ratingStarImage: {
    height: 20,
    width: 20,
  },
  productDetailsContainer: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookmarkImage: {
    height: 30,
    width: 14,
    resizeMode: 'contain',
    marginRight: 12,
  },
  heartImage: {
    height: 30,
    width: 25,
    resizeMode: 'contain',
  },
  startImage: {
    width: 25,
    height: 25,
    marginRight: 3,
  },
  assessmentRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  reviewContainer: {
    minHeight: 200,
    width: deviceWidth - 40,
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 10,
    borderRadius: 20,
    padding: 15,
  },
  reviewerImage: {
    height: 43,
    width: 43,
    resizeMode: 'contain',
    borderRadius: 20,
  },
  reviewerName: {
    lineHeight: 18,
  },
  reviewDateText: {
    lineHeight: 15,
    color: colors.tabBarGray,
    marginTop: 5,
  },
  reviewText: {
    lineHeight: 15,
    color: colors.tabBarGray,
    marginTop: 5,
    marginLeft: 55,
  },
  reviewLikeUnLikeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 55,
    marginTop: 15,
  },
  reviewLikeImage: {
    height: 19,
    width: 19,
    resizeMode: 'contain',
  },
  reviewCountText: {
    color: colors.tabBarGray,
  },
})
