import { StyleSheet } from 'react-native'
import { colors } from '../../constants'

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flexGrow: 1,
  },
  bodyContainer: {
    flex: 1,
    marginTop: 30
  },
  mainContainer: {
    paddingHorizontal:20,
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  flatList: {
    flex: 1
  },
  flatListContainer: {
    paddingVertical: 20,
    flexGrow: 1,
  },
  optionTitleText: {
    marginLeft: -20
  },
  optionArrowImage: {
    transform: [{ rotate: '180deg' }],
    tintColor: colors.lightBlackSecondary,
  },
  emptyViewMainContainer: {
    marginTop: '40%'
  },
})
export default styles
