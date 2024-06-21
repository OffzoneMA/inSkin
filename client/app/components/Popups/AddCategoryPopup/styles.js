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
  divider: {
    height: 1,
    backgroundColor: colors.dividerGray,
  },
  closeImageContainer: {
    width: 35,
    height: 35,
  },
  closeImage: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
    tintColor: colors.lightGray,
  },
  bodyContainer: {
    marginTop: 10,
  },
  confirmButton: {
    height: 72,
    borderRadius: 100,
    marginTop: 50,
  },
  confirmButtonText: {
    fontSize: 20,
  },
  createText: {
    fontSize: 15,
    marginLeft: -10,
    color: colors.inputTextColor,
  },
  createMainContainer: {
    paddingVertical: 10
  },
  createLeftImageTitleContainer: {
    alignItems: 'center'
  },
  plusImage: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  checkboxImage: {
    width: 16,
    height: 16,
  },
  flexRow:{
    flexDirection:'row',
  }
})
export default styles
