import { StyleSheet } from 'react-native'
import { colors } from '../../constants'

export const styles = StyleSheet.create({
  slideContainer: {
    height: 340,
    width: 310,
    backgroundColor: colors.white,
    alignSelf: 'center',
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    shadowColor: colors.shadow,
  },
  slideMainContainer: {
    padding: 10
  },
  closeIcon: {
    height: 12,
    width: 12,
    top: 30,
    position: 'absolute',
    right: 22,
    tintColor: colors.black,
  },
  userAvatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginTop: 24,
  },
  userName: {
    lineHeight: 27,
    alignSelf: 'center',
    marginTop: 10,
    width: '100%',
    textAlign: 'center'
  },
  productImagesContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  productImage: {
    height: 90,
    width: 90,
    borderRadius: 8,
    marginRight: 2,
  },
  followButton: {
    marginTop: 16,
    width: 124,
    alignSelf: 'center',
    borderRadius: 8,
    height: 36,
  },
  mainContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
})
