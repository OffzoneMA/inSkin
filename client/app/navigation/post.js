import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import PostHome from "../screens/post/post";
import SafeScreen from "../components/SafeScreen";

const Stack = createStackNavigator();

export default function postNavigator() {
  return (
      <Stack.Navigator
       
        initialRouteName="PostHome"
      >
        <Stack.Screen name="My posts" component={PostHome} />
      </Stack.Navigator>
  );
}
