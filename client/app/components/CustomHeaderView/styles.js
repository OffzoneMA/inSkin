import { StyleSheet } from 'react-native'
import { FountsEnum } from '../../constants/constants'
import { colors } from '../../constants'

const styles = StyleSheet.create({
  blankView: {
    minWidth: 36,
  },
  titleText: {
    alignSelf: 'center',
    fontSize: 18,
    textAlign: 'center',
    flex: 1,
  },
  mainContainer: {
    paddingVertical: 10,
    flexDirection: 'row',
  },
  languageTouchContainer: {
    justifyContent: 'center',
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 18,
  },
  arrowImage: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    marginLeft: 5,
    transform: [{ rotate: '270deg' }],
  },
  notificationBadge: {
    height: 10,
    width: 10,
    backgroundColor: colors.pink,
    borderRadius: 5,
    position: 'absolute',
    right: 0,
    top: 15,
    zIndex: 1
  }
})
export default styles
