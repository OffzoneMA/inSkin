import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import OnboardingScreen from "../screens/onboarding/swiper";
import GetStartedScreen from "../screens/onboarding/getstarted";

import AuthNavigator from "./auth";

const Stack = createStackNavigator();

export default function OnboardingNavigator() {
  return (
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="GetStarted"
      >
        <Stack.Screen name="GetStarted" component={GetStartedScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
  );
}
