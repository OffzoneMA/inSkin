import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  mainBubbleContainer: {
    marginVertical: 10,
    paddingHorizontal: 4,
    flexDirection: 'row',
  },
  textContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    maxWidth: '60%',
  },
  cornerMarkImage: {
    width: 16,
    height: 13,
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
  },
  sendStatusContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  sendStatusImage: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginRight: 6,
  },
})
export default styles
