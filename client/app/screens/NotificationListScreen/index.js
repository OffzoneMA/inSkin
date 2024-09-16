import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import { FlatList, SafeAreaView, View ,Text,} from 'react-native'
import styles from './styles'
import CustomHeaderView from '../../components/CustomHeaderView'
import { images } from '../../constants'
import { LocalesMessages } from '../../constants/locales'
import { useNavigation } from '@react-navigation/native'
import notificationData from '../../../data/notificationListData.json'
import NotificationListView from './NotificationListView'
import authApi from "../../api/auth";
import { useFocusEffect } from "@react-navigation/native";
import productActionsApi from "../../api/product_actions";
import AuthContext from "../../contexts/auth";
const NotificationListScreen = () => {
  const [notificationliste, setNotificationliste] = useState([]);
  const navigation = useNavigation()
  const getnotification = async () => {
    try {
      const result = await productActionsApi.getnotifications()
      setNotificationliste(result.data)
      console.log("result de notification",result.data);
      
    } catch (error) {
      console.error("Error getting product data: ", error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      getnotification();
      console.log("notificationliste.length",notificationliste.length)
      console.log("notificationliste.length",notificationliste)
    }, [])
  );
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {notificationliste.length == 0 ? (
        <Text>Aucune notification trouvée.</Text>
      ) : (
        <FlatList
        data={notificationliste}
        renderItem={({ item, index }) => {
          return <NotificationListView item={item} />
        }}
      /> 
      )}
    </View>
  
    </SafeAreaView>
  )
}

export default NotificationListScreen;
