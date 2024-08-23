import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  topViewContainer: {
    marginVertical: 23,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    height: 94,
    width: 94,
  },
  nameFollowerMainContainer: {
    marginLeft: 27,
  },
  followerPostContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  followerContainer: {
    marginRight: 32,
  },
  numberText: {
    lineHeight: 17,
  },
  followerPostText: {
    lineHeight: 17,
  },
  profileIconWrapper: {
    borderRadius: 98,
    flex: 1,
  },
  profilePictureContainer: {
    borderRadius: 100,
    marginBottom: 10,
    borderWidth: 2,
    padding: 2,
    width: 80,
    height: 80,
    marginRight: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: 'black',
     size:'font18px',
    fontFamily:'semiBold'
    
  },
})
export default styles
