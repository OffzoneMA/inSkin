import React from 'react'
import { FlatList, SafeAreaView, View } from 'react-native'
import styles from './styles'
import CustomHeaderView from '../../components/CustomHeaderView'
import { images } from '../../constants'
import { LocalesMessages } from '../../constants/locales'
import { useNavigation } from '@react-navigation/native'
import notificationData from '../../../data/notificationListData.json'
import NotificationListView from './NotificationListView'
const NotificationListScreen = () => {
  const navigation = useNavigation()
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.mainContainer]}>
        <CustomHeaderView
          leftButtonImage={images.backButton}
          title={LocalesMessages.notifications}
          leftButtonOnPress={() => {
            navigation.goBack()
          }}
          isFromNotificationHeader={true}
          rightButtonImage={images.bellIcon}
          rightImageStyle={{
            height: 22,
            width: 22,
            resizeMode: 'contain',
          }}
          rightButtonOnPress={() => {}}
        />
      </View>
      <FlatList
        data={notificationData.notifications}
        renderItem={({ item, index }) => {
          return <NotificationListView item={item} />
        }}
      />
    </SafeAreaView>
  )
}

export default NotificationListScreen;
