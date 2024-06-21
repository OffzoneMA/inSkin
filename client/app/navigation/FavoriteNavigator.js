import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { Route } from '../constants/constants'
import FavoriteScreen from '../screens/FavoriteScreen'
import FavoriteDetailScreen from '../screens/FavoriteDetailScreen'

const Stack = createNativeStackNavigator()

const FavoriteNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={Route.FavoriteScreen}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={Route.FavoriteScreen} component={FavoriteScreen} />
      <Stack.Screen name={Route.FavoriteDetailScreen} component={FavoriteDetailScreen} />
    </Stack.Navigator>
  )
}

export default FavoriteNavigator
