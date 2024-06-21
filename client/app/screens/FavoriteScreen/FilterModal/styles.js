import { StyleSheet } from 'react-native'
import { colors } from '../../../constants'

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
  },
  dividerTop: {
    height: 2,
    width: 40,
    backgroundColor: colors.dividerGray,
    borderRadius: 1,
    marginTop: 6,
    alignSelf: 'center'
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
  divider: {
    height: 1,
    backgroundColor: colors.dividerGray,
  },
  title: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  confirmButton: {
    height: 72,
    borderRadius: 100,
    marginTop: 50,
  },
  confirmButtonText: {
    fontSize: 20,
    fontFamily: 'medium'
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginVertical: 2,
  },
  checkBoxImage: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
})
export default styles
