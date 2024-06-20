import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { Route } from '../constants/constants'
import SearchScreen from '../screens/SearchScreen'

const Stack = createNativeStackNavigator()

const SearchNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={Route.SearchScreen}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={Route.SearchScreen} component={SearchScreen} />
    </Stack.Navigator>
  )
}

export default SearchNavigator
