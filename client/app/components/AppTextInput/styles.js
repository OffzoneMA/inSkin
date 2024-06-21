import { StyleSheet } from 'react-native'
import { colors } from '../../constants'
import { FountsEnum } from '../../constants/constants'

const styles = StyleSheet.create({
  iconImage: {
    height: 36,
    width: 36,
    resizeMode: 'contain',
  },
  iconImageContainer: {
    minHeight: 10,
    minWidth: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    marginLeft: 3,
  },
  mainBorderContainer: {
    marginTop: 6,
    borderRadius: 10,
    borderWidth: 3,
  },
  borderContainer: {
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    alignItems: 'center',
    paddingHorizontal: 14,
    flexDirection: 'row',
    backgroundColor: colors.white,
  },
  leftImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  arrowImage: {
    transform: [{ rotate: '270deg' }],
    width: 10,
    height: 13,
    resizeMode: 'contain',
    marginLeft: 5,
  },
  textInput: {
    flex: 1,
    fontFamily: FountsEnum.PrimaryRegular,
    fontSize: 14,
    color: colors.inputTextColor,
    height: 40,
  },
  passwordButtonContainer: {
    width: 35,
    height: 35,
    marginRight: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordImage: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
})
export default styles
