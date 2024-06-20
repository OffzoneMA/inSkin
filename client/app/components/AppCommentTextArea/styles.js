import { StyleSheet } from 'react-native'
import { colors } from '../../constants'

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center'
  },
  textInputStyle: {
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 50,
    maxHeight: 125,
    flex: 1,
    padding: 10,
    paddingVertical: 15,
    borderColor: colors.inputBorder,
    textAlignVertical: 'center',
    color: colors.tabBarGray
  },
  sendButtonContainer: {
    height: 50,
    width: 50,
    backgroundColor: colors.pink,
    borderRadius: 8,
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
})
