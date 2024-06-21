import React from 'react'
import { Image, View } from 'react-native'
import styles from './styles'
import { colors, images } from '../../../constants'
import AppText from '../../../components/AppText'
import AppButton from '../../../components/AppButton'
import { LocalesMessages } from '../../../constants/locales'
import { useSelector } from 'react-redux'
import { selectUserProfile } from '../../../redux/selector/appSelectors'

function ProfileFollowerView({ onPressEditProfile }) {
  const userProfileSelector = useSelector(selectUserProfile)
  return (
    <View>
      <View style={styles.topViewContainer}>
        <Image source={images.userAvatar} style={styles.avatarImage} />
        <View style={styles.nameFollowerMainContainer}>
          <AppText
            text={`${userProfileSelector.firstName} ${userProfileSelector.lastName}`}
            size='font18px'
            fontFamily='semiBold'
          />
          <View style={styles.followerPostContainer}>
            <View style={styles.followerContainer}>
              <AppText
                text='120'
                size='font12px'
                fontFamily='medium'
                color={colors.lightBlack}
                style={styles.numberText}
              />
              <AppText
              localizedText={LocalesMessages.followers}
                size='font12px'
                color={colors.tabBarGray}
                style={styles.followerPostText}
              />
            </View>
            <View>
              <AppText
                text='34'
                size='font12px'
                fontFamily='medium'
                color={colors.lightBlack}
                style={styles.numberText}
              />
              <AppText
              localizedText={LocalesMessages.posts}
                size='font12px'
                color={colors.tabBarGray}
                style={styles.followerPostText}
              />
            </View>
          </View>
        </View>
      </View>
      <AppButton localizedText={LocalesMessages.editProfile} onPress={onPressEditProfile} />
    </View>
  )
}

export default ProfileFollowerView;
