import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/login";
import RegisterScreen from "../screens/register";
import LoadingScreen from "../screens/loading";
import AppNavigator from "./appNav";
import Forgotpassword from "../screens/forgofpassword"
const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register1" component={RegisterScreen} />
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="App" component={AppNavigator} />
        <Stack.Screen name="Forgotpassword" component={Forgotpassword}/>
      </Stack.Navigator>
  );
}
