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
import PersonalDetailScreen from '../screens/PersonalDetailScreen';
import { TouchableOpacity } from 'react-native';
import ScanNavigator from "../screens/scan/home";
import MyProfileScreen from '../screens/MyProfileScreen';
import SocialMediaListScreen from '../screens/SocialMediaListScreen';
import SettingScreen from '../screens/SettingScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import LegalInfoScreen from '../screens/LegalInfoScreen'
import { Route } from '../constants/constants';
import SupportScreen from '../screens/SupportScreen';
import NotificationOptionsScreen from '../screens/NotificationOptionsScreen';
import PushNotificationScreen from '../screens/PushNotificationScreen'
import FeedDetailScreen from '../screens/FeedDetailScreen'
const Stack = createStackNavigator();


export default function ProfileNavigator() {
  const theme = useTheme();
  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
      initialRouteName="ProfileHome"
    >
      <Stack.Screen
        name="ProfileHome"
        options={{ title: "Profile" }}
        component={ProfileHome}

      />
      <Stack.Screen
        name="ProfileEdit"
        options={{ title: "Edit" }}
        component={ProfileEdit}
      />
      <Stack.Screen
        name="MyProfileScreen"
        options={{ title: "MyProfileScreen" }}
        component={MyProfileScreen}
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
      <Stack.Screen name={Route.SocialMediaListScreen} component={SocialMediaListScreen} />
      <Stack.Screen name={Route.SettingScreen} component={SettingScreen} />
      <Stack.Screen name={Route.PersonalDetailScreen} component={PersonalDetailScreen} />
      <Stack.Screen name={Route.ChangePasswordScreen} component={ChangePasswordScreen} />
      <Stack.Screen name={Route.LegalInfoScreen} component={LegalInfoScreen} />
      <Stack.Screen name={Route.SupportScreen} component={SupportScreen} />
      <Stack.Screen name={Route.NotificationOptionsScreen} component={NotificationOptionsScreen} />
      <Stack.Screen name={Route.PushNotificationScreen} component={PushNotificationScreen} />
      <Stack.Screen name={Route.FeedDetailScreen} component={FeedDetailScreen} />
    </Stack.Navigator>
  );
}
