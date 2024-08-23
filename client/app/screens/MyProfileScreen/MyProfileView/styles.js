import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 26,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 109,
    height: 93,
  },
  avatarImage: {
    width: 93,
    height: 93,
  },
  imageLoadButtonContainer: {
    width: 56,
    height: 32,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  nameFollowerContainer: {
    marginTop: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paidProfileImage: {
    width: 20,
    height: 20,
    marginLeft: 6,
  },
  followerPostContainer: {
    flexDirection: 'row',
  },
  followerPostText: {
    marginLeft: 6,
  },
  postCountText: {
    marginLeft: 16,
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
})
export default styles
