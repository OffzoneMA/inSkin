import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { styles } from './styles'
import { images } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { Route } from '../../constants/constants'

const HomeHeader = () => {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <View style={styles.appTitleContainer}>
        <Image source={images.appTitle} style={styles.appTitleImage} />
      </View>
      <View style={styles.rightActionButtonContainer}>
        <TouchableOpacity activeOpacity={0.6}>
          <Image source={images.userAvatar} style={styles.userAvatarImage} />
        </TouchableOpacity>
        <View style={styles.notificationBadge} />
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            navigation.navigate(Route.NotificationListScreen)
          }}>
          <View style={styles.bellIconContainer}>
            <Image source={images.bellIcon} style={styles.bellIcon} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default HomeHeader
