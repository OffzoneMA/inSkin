import { Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors, images } from '../../../constants'
import AppText from '../../../components/AppText'
import styles from './styles'
import { LocalesMessages } from '../../../constants/locales'

const NotificationListView = ({ item }) => {
  const isFollowing = item.isFollowing
  const isPost = item.isPost
  return (
    <View style={styles.mainContainer}>
      <View style={styles.shadowContainer}>
        <View style={styles.leftContentContainer}>
          {isFollowing ? (
            <Image source={images.homeCarouselAvatar} style={styles.avatarImage} />
          ) : (
            <></>
          )}
          <View style={styles.titleDescContainer}>
            <AppText
              text={isFollowing ? item.userName : item.messageText}
              size='font12px'
              fontFamily='medium'
              color={colors.lightBlackSecondary}
              numberOfLines={1}
            />
            {isFollowing ? (
              <AppText
                text={item.messageText}
                size='font10px'
                color={colors.tabBarGray}
                numberOfLines={1}
                style={styles.messageText}
              />
            ) : isPost ? (
              <TouchableOpacity>
                <>
                  <AppText
                  text={LocalesMessages.goToPost}
                    size='font10px'
                    color={colors.tabBarGray}
                    numberOfLines={1}
                    style={styles.messageText}
                  />
                  <View style={styles.postButtonDivider} />
                </>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        </View>
        <AppText
          text={'Oct 24'}
          size='font10px'
          color={colors.tabBarGray}
          numberOfLines={1}
        />
      </View>
    </View>
  )
}

export default NotificationListView;
