import { StyleSheet } from 'react-native'
import { colors } from '../../constants'

const styles = StyleSheet.create({
  touchContainer: {
    width: '100%',
  },
  mainContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftImageTitleContainer: {
    flexDirection: 'row',
  },
  leftImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  titleDescContainer: {
    marginLeft: 20,
    justifyContent: 'center',
  },
  descText: {
    marginTop: 4,
  },
  rightPushOptionText: {
    marginRight: 10,
  },
  rightImage: {
    width: 11,
    height: 11,
    resizeMode: 'contain',
  },
  rightImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    height: 1,
    backgroundColor: colors.dividerGray,
    marginVertical: 18,
  },
})
export default styles
