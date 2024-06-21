import { StyleSheet } from 'react-native'
import { colors } from '../../constants'

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerTitleContainer: {
    marginHorizontal: 40
  },
  welcomeTagLine: {
    alignSelf: 'center',
    marginTop: 28,
    width: '100%',
    color: colors.black,
    lineHeight: 24,
    textAlign: 'center',
  },
  welcomeSubTagLine: {
    color: colors.subTitleGray,
    width: '100%',
    alignSelf: 'center',
    lineHeight: 20,
    textAlign: 'center'
  },
})
