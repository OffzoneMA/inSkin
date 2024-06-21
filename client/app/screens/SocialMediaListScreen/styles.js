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
    justifyContent: 'space-between',
    flex: 1,
  },
  mainContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flex: 1,
  },
  subMainContainer: {
    marginTop: 20,
  },
  scrollView: {
    flexGrow: 1,
  },
  fontWeight500: {
    fontFamily: 'medium'
  },
  textInputMainContainer: {
    marginVertical: 30,
  },
  confirmButton: {
    height: 72,
    borderRadius: 100,
  },
  confirmButtonText: {
    fontSize: 20,
  },
  optionArrowImage: {
    transform: [{ rotate: '180deg' }],
    tintColor: colors.lightBlackSecondary,
  },
  textinputMainContainer: {
    marginVertical: 10
  },
})
export default styles
