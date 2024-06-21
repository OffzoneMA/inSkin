import { StyleSheet } from 'react-native'
import { colors } from '../../constants'

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flexGrow: 1
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 30
  },
  mainContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginHorizontal: 20,
  },
  mainOptionContainer: {
    marginTop: 60,
  },
  optionArrowImage: {
    transform: [{ rotate: '180deg' }],
    tintColor: colors.lightBlackSecondary,
  },
})
export default styles
