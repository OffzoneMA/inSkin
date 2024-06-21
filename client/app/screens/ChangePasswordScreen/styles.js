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
    marginTop: 30,
  },
  mainContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
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
