import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BrowseNavigator from "./browse";
import ProfileNavigator from "./profile";
import ScanNavigator from "./scan";
import { useTheme } from "@ui-kitten/components";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Tab = createMaterialTopTabNavigator();

export default function AppTabNavigator() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: theme["color-primary-default"],
        inactiveTintColor: theme["color-basic-600"],
        showIcon: true, // Show icons in tabs
        labelStyle: {
          fontSize: 12,
          fontWeight: "bold", // Make the tab labels bold
          marginVertical: 0,
        },
        style: {
          backgroundColor: theme["color-basic-100"], // Background color of the tab bar
        },
        indicatorStyle: {
          backgroundColor: theme["color-primary-default"], // Color of the active tab indicator
        },
        iconStyle: {
          marginVertical: 0, // Remove vertical margin
        },
      }}
    >
      <Tab.Screen
        name="Browse"
        component={BrowseNavigator}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name={focused ? "magnify-expand" : "magnify-expand"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={ScanNavigator}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name={focused ? "barcode-scan" : "barcode-scan"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name={focused ? "account-outline" : "account-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
