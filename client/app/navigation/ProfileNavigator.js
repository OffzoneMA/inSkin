import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { Route } from '../constants/constants'
import ProfileScreen from '../screens/ProfileScreen'
import MyProfileScreen from '../screens/MyProfileScreen'
import SocialMediaListScreen from '../screens/SocialMediaListScreen'
import SettingScreen from '../screens/SettingScreen'
import NotificationOptionsScreen from '../screens/NotificationOptionsScreen'
import PushNotificationScreen from '../screens/PushNotificationScreen'

const Stack = createNativeStackNavigator()

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={Route.ProfileScreen}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={Route.ProfileScreen} component={ProfileScreen} />
      <Stack.Screen name={Route.MyProfileScreen} component={MyProfileScreen} />
      <Stack.Screen name={Route.SocialMediaListScreen} component={SocialMediaListScreen} />
      <Stack.Screen name={Route.SettingScreen} component={SettingScreen} />
      <Stack.Screen name={Route.NotificationOptionsScreen} component={NotificationOptionsScreen} />
      <Stack.Screen name={Route.PushNotificationScreen} component={PushNotificationScreen} />
    </Stack.Navigator>
  )
}

export default ProfileNavigator;
