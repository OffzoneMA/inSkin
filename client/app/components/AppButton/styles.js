import { StyleSheet } from 'react-native'
import { APP_BUTTON_DEFAULT_HIGHT, APP_BUTTON_DEFAULT_MIN_WIDTH, FountsEnum } from '../../constants/constants'
import { colors } from '../../constants'
/**
 * default styling which is applied to the app button globally to maintain consistency
 * can be override with the props
 * */
export const styles = StyleSheet.create({
  /**
   * main button container style
   */
  appButtonContainer: {
    width: '100%',
    height: APP_BUTTON_DEFAULT_HIGHT,
    minWidth: APP_BUTTON_DEFAULT_MIN_WIDTH,
    /**
     * primary color is applied here so if we change the color styles applied in whole app
     * */
    backgroundColor: colors.pink,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appButtonLabelText: {
    color: colors.white,
    fontSize: 14,
  },
})
