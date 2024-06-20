import { StyleSheet } from 'react-native'
import { colors } from '../../constants'

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bodyContainer: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  body: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  emptyViewMainContainer: {
    marginTop: '50%',
  },
  flxRow: {
    flexDirection: 'row',
  },
  categoryText: {
    marginVertical: 5,
    marginRight: 10,
  },
})
