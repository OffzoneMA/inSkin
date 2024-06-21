import { Platform, StyleSheet } from 'react-native'
import { colors } from '../../constants'

export const styles = StyleSheet.create({
  mainContainer: {
    width: 75,
    height: 75,
    borderRadius: 37,
    backgroundColor: colors.pink,
    position: 'absolute',
    bottom: Platform.OS == 'android' ? 72 : 82,
    right: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8,
  },
  scanImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
})
