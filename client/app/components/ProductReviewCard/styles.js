import { StyleSheet } from 'react-native'
import { deviceWidth } from '../../constants/constants'
import { colors } from '../../constants'

export const styles = StyleSheet.create({
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
    lineHight: 18,
  },
  reviewDateText: {
    lineHight: 15,
    color: colors.tabBarGray,
    marginTop: 5,
  },
  reviewText: {
    lineHight: 15,
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
