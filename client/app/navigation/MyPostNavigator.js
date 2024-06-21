import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { Route } from '../constants/constants'
import MyPostScreen from '../screens/MyPostScreen'

const Stack = createNativeStackNavigator()

const MyPostNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={Route.MyPostScreen}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={Route.MyPostScreen} component={MyPostScreen} />
    </Stack.Navigator>
  )
}

export default MyPostNavigator
