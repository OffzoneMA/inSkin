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
    borderRadius: 10,
    marginTop: 32,
  },
  likeCountFont: {
    marginLeft: 5,
    lineHight: 16,
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
    lineHight: 24,
  },
  productSubDesc: {
    lineHight: 15,
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
    height: 18,
    width: 14,
    resizeMode: 'contain',
    marginRight: 12,
  },
  heartImage: {
    height: 18,
    width: 20,
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
})
