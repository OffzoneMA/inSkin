import { StyleSheet } from "react-native"
import { colors } from "../../constants"

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flexGrow: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  mainContainer: {
    alignItems: 'center',
    marginTop: -10,
  },
  leftImage: {
    width: 15,
    height: 15,
  },
  rightImage: {
    width: 15,
    height: 15,
    tintColor: colors.lightGray,
  },
  headerButtonContainer: {
    width: 45,
    height: 45,
  },
  divider: {
    height: 1,
    backgroundColor: colors.dividerGray,
  },
  headerTitle: {
    textAlign: 'flex-start',
    paddingLeft: 14,
  },
})
export default styles