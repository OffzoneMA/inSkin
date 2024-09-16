import { StyleSheet } from 'react-native'
import { colors } from '../../../constants'

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
  },
  mainContainer: {
    backgroundColor: colors.white,
    justifyContent: 'flex-start',
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    alignItems: 'center',
  },
  closeImage: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    tintColor: colors.lightGray,
  },
  closeImageContainer: {
    width: 35,
    height: 35,
  },
  divider: {
    height: 1,
    backgroundColor: colors.dividerGray,
  },
  bodyContainer: {
    marginTop: 10,
  },
  flexRow: {
    flexDirection: 'row',
  },
  plusImage: {
    width: 21,
    height: 21,
    resizeMode: 'contain',
  },
  createText: {
    fontSize: 14,
    marginLeft: -10,
    color: colors.inputTextColor,
    fontFamily: 'regular'
  },
  createMainContainer: {
    paddingVertical: 5,
  },
  createLeftImageTitleContainer: {
    alignItems: 'center',
  },
})
export default styles
