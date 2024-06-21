import { StyleSheet } from 'react-native'
import { colors } from '../../../constants'

const styles = StyleSheet.create({
  mainContainer: {
    padding: 5,
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  shadowContainer: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 20,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    minHeight: 64,
  },
  leftContentContainer: {
    flexDirection: 'row',
  },
  avatarImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    borderRadius: 20,
  },
  titleDescContainer: {
    marginLeft: 14,
  },
  messageText: {
    marginTop: 3,
  },
  postButtonDivider: {
    height: 1,
    width: 52,
    backgroundColor: colors.dividerGray,
  },
})
export default styles
