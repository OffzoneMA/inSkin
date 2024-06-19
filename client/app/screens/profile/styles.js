import { StyleSheet } from 'react-native'
import { colors } from '../../constants'

const styles = StyleSheet.create({
  myProfileButton: {
    alignSelf: 'flex-end',
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mainContainer: {
    paddingHorizontal: 20,
  },
  scrollView: {
    flexGrow: 1,
  },
  flatList: {
    marginVertical: 10,
  },
  flatListContainer: {
    paddingVertical: 20,
    flexGrow: 1,
  },
})
export default styles
