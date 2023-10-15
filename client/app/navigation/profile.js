import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProfileHome from "../screens/profile/home";
import ProfileSaved from "../screens/profile/saved";
import ProfileAbout from "../screens/profile/about";
import ProfileSettings from "../screens/profile/settings";

const Stack = createStackNavigator();

export default function ProfileNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="ProfileHome"
    >
      <Stack.Screen
        name="ProfileHome"
        options={{ title: "Profile" }}
        component={ProfileHome}
      />
      <Stack.Screen
        name="ProfileSaved"
        options={{ title: "Saved" }}
        component={ProfileSaved}
      />
      <Stack.Screen
        name="ProfileAbout"
        options={{ title: "About" }}
        component={ProfileAbout}
      />
      <Stack.Screen
        name="ProfileSettings"
        options={{ title: "Settings" }}
        component={ProfileSettings}
      />
    </Stack.Navigator>
  );
}
