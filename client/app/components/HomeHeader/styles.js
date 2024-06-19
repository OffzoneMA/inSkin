import { StyleSheet } from 'react-native'
import { deviceWidth } from '../../constants/constants'
import { colors } from '../../constants'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    width: deviceWidth,
    justifyContent: 'space-between',
    alignContent: 'center',
    paddingHorizontal: 20,
  },
  appTitleContainer: {
    height: 50,
    width: 100,
    justifyContent: 'center',
  },
  appTitleImage: {
    height: 30,
    width: 80,
    resizeMode: 'contain',
  },
  rightActionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatarImage: {
    height: 36,
    width: 36,
    marginRight: 10,
    resizeMode: 'contain',
  },
  bellIconContainer: {
    height: 38,
    width: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
  },
  notificationBadge: {
    height: 10,
    width: 10,
    backgroundColor: colors.pink,
    borderRadius: 5,
    position: 'absolute',
    right: 8,
    top: 5,
    zIndex: 1
  }
})
