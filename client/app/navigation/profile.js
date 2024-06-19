import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Icon, useTheme } from '@ui-kitten/components';
import ProfileHome from "../screens/profile/home";
import ProfileEdit from "../screens/profile/edit";
import ProfileEdit1 from "../screens/profile/edit1";
import ProfileSaved from "../screens/profile/saved";
import ProfileAbout from "../screens/profile/about";
import ProfileSettings from "../screens/profile/settings";
import Changepassword from "../screens/profile/changepassword";
import Newpassword from "../screens/profile/newpassword";
import { TouchableOpacity } from 'react-native';
import ScanNavigator from "../screens/scan/home";
const Stack = createStackNavigator();

export default function ProfileNavigator() {
  const theme = useTheme();
  return (
    <Stack.Navigator
    screenOptions={{ 
     
    }}
      initialRouteName="ProfileHome"
    >
      <Stack.Screen
        name="ProfileHome"
        component={ProfileHome}
        options={{
          
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="ProfileEdit"
        options={{ title: "Edit" }}
        component={ProfileEdit}
      />
      <Stack.Screen
        name="ProfileEdit1"
        options={{ title: "Profile" }}
        component={ProfileEdit1}
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
       <Stack.Screen
        name="Changepassword"
        options={{ title: "Settings" }}
        component={Changepassword}
      />
       <Stack.Screen
        name="Newpassword"
        options={{ title: "Settings" }}
        component={Newpassword}
      />
      <Stack.Screen
        name="ScanNavigator"
        options={{ title: "ScanNavigator" }}
        component={ScanNavigator}
      />
    </Stack.Navigator>
  );
}
