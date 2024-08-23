import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import BottomTabNavigator from './BottomTabNavigator'
import { Route, RouteNavigator } from '../constants/constants'
import FeedDetailScreen from '../screens/FeedDetailScreen'
import PersonalDetailScreen from '../screens/PersonalDetailScreen'
import LegalInfoScreen from '../screens/LegalInfoScreen'
import WebViewScreen from '../screens/WebViewScreen'
import ChangePasswordScreen from '../screens/ChangePasswordScreen'
import MyPostNavigator from './MyPostNavigator'
import SupportScreen from '../screens/SupportScreen'

const Stack = createNativeStackNavigator()

const RouterNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={RouteNavigator.TabNavigator}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={RouteNavigator.TabNavigator} component={BottomTabNavigator} />
      <Stack.Screen name={Route.FeedDetailScreen} component={FeedDetailScreen} />
      <Stack.Screen name={Route.PersonalDetailScreen} component={PersonalDetailScreen} />
      <Stack.Screen name={Route.LegalInfoScreen} component={LegalInfoScreen} />
      <Stack.Screen name={Route.WebViewScreen} component={WebViewScreen} />
      <Stack.Screen name={Route.ChangePasswordScreen} component={ChangePasswordScreen} />
      <Stack.Screen name={Route.SupportScreen} component={SupportScreen} />
    </Stack.Navigator>
  )
}

export default RouterNavigator
