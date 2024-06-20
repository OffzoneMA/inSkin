import { Image, View } from 'react-native'
import React from 'react'
import AppIconButton from '../../../components/AppIconButton'
import { colors, images } from '../../../constants'
import AppText from '../../../components/AppText'
import styles from './styles'
import { useSelector } from 'react-redux'
import { selectUserProfile } from '../../../redux/selector/appSelectors'
import { LocalesMessages } from '../../../constants/locales'

const MyProfileView = () => {
  const [profileImage, setProfileImage] = React.useState(images.userAvatarBlank);
  const userProfileSelector = useSelector(selectUserProfile)
  const onPressUpdateImage = () => {
    setProfileImage(images.userAvatar)
  }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.avatarContainer}>
        <Image source={profileImage} style={styles.avatarImage} />
        <AppIconButton
          imageSource={images.downloadAvatarImage}
          imageTouchContainerStyle={styles.imageLoadButtonContainer}
          onPress={onPressUpdateImage}
        />
      </View>
      <View style={styles.nameFollowerContainer}>
        <View style={styles.nameContainer}>
          <AppText
            text={`${userProfileSelector.firstName} ${userProfileSelector.lastName}`}
            size='font18px'
            fontFamily='semiBold'
            color={colors.lightBlack}
          />
          <Image source={images.paidProfile} style={styles.paidProfileImage} />
        </View>
        <View style={styles.followerPostContainer}>
          <AppText text='120' size='font12px' color={colors.tabBarGray} />
          <AppText
          localizedText={LocalesMessages.followers}
            text='Followers'
            size='font12px'
            color={colors.tabBarGray}
            style={[styles.followerPostText]}
          />
          <AppText
            text='34'
            size='font12px'
            color={colors.tabBarGray}
            style={[styles.postCountText]}
          />
          <AppText
          localizedText={LocalesMessages.posts}
            size='font12px'
            color={colors.tabBarGray}
            style={[styles.followerPostText]}
          />
        </View>
      </View>
    </View>
  )
}

export default MyProfileView;
