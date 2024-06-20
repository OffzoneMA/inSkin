import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import HomeScreen from '../screens/HomeScreen'
import { Route } from '../constants/constants'
import NotificationListScreen from '../screens/NotificationListScreen'

const Stack = createNativeStackNavigator()

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={Route.HomeScreen}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={Route.HomeScreen} component={HomeScreen} />
      <Stack.Screen name={Route.NotificationListScreen} component={NotificationListScreen} />
    </Stack.Navigator>
  )
}

export default HomeNavigator
