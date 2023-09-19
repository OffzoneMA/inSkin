import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BrowseNavigator from "./browse";
import ProfileNavigator from "./profile";
import ScanNavigator from "./scan";
import {
  useTheme,
} from "@ui-kitten/components";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
 
export default function AppTabNavigator() {
  const theme = useTheme(); 

  return (
    <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'barcode-scan' : 'barcode-scan';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'account-outline' : 'account-outline';
            } else if (route.name === 'Browse') {
              iconName = focused ? 'magnify-expand' : 'magnify-expand';
            }

            // You can customize the icon styles here
            return <MaterialCommunityIcons 
              name={iconName}
              size={size}
              color={color}
            />;
          },
        })}
        tabBarOptions={{
          activeTintColor: theme["color-primary-default"], // Color of the active tab
          inactiveTintColor: theme['color-basic-600'], // Color of inactive tabs
        }}
      >
        
      <Tab.Screen
        name="Browse"
        component={BrowseNavigator}
        options={{
          tabBarLabel: '', // Empty string to remove the text
        }}
      />
      <Tab.Screen
        name="Home"
        component={ScanNavigator}
        options={{
          tabBarLabel: '', // Empty string to remove the text
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarLabel: '', // Empty string to remove the text
        }}
      />
    </Tab.Navigator>
        
  );
}
