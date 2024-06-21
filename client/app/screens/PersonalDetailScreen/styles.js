import { StyleSheet } from 'react-native'
import { colors } from '../../constants'

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  subMainContainer: {
    marginTop: 37,
  },
  scrollView: {
    flexGrow: 1,
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
})
export default styles
