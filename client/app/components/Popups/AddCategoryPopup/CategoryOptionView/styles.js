import { StyleSheet } from 'react-native'
import { colors } from '../../../../constants'

const styles = StyleSheet.create({
  touchContainer: {
    marginVertical: 10,
  },
  radioImage: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  titleText: {
    marginLeft: 12,
  },
  mainContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderColor: colors.categoryOptionBorder,
    borderRadius: 8,
    alignItems: 'center',
  },
})
export default styles
