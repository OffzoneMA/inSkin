import { StyleSheet } from 'react-native'
import { deviceWidth } from '../../../constants/constants'
import { colors } from '../../../constants'

export const styles = StyleSheet.create({
  cardContainer: {
    minHeight: 430,
    width: deviceWidth - 40,
    alignSelf: 'center',
    marginTop: 22,
  },
  productImage: {
    height: 210,
    width: deviceWidth - 40,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  productNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productActionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: colors.black,
  },
  productDescContainer: {
    flexDirection: 'row',
    marginTop: 22,
  },
  commentUserAvatar: {
    height: 43,
    width: 43,
    borderRadius: 20,
  },
  commentDataText: {
    lineHeight: 18,
    marginLeft: 12,
    marginBottom: 5,
    color: colors.tabBarGray,
  },
  ratingViewContainer: {
    height: 12,
    width: 12,
    marginRight: 2,
  },
  productLikeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  productLikeButton: {
    height: 18,
    width: 18,
    marginTop: 4,
    resizeMode: 'contain',
    tintColor: colors.pink,
  },
  dividerView: {
    width: deviceWidth - 40,
    height: 1,
    backgroundColor: colors.dividerGray,
    alignSelf: 'center',
    marginTop: 22,
  },
  productNameText: {
    lineHeight: 24,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productChanelText: {
    lineHeight: 18,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  postBrand: {
    fontSize: 14,
    color: '#888',
    marginLeft: 60,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  postDetails: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  commentUserNameText: {
    lineHeight: 18,
  },
  commentText: {
    lineHeight: 15,
    color: colors.tabBarGray,
  },
  productLikeCountText: {
    lineHeight: 15,
    alignSelf: 'flex-end',
    color: colors.tabBarGray,
    marginLeft: 2,
  },
})
