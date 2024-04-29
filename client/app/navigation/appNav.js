import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AppTabNavigator from "./appTab";
import ProductScreen from "../screens/product/home"; // Import your Product screen component here
import { useTheme } from "@ui-kitten/components";
import {
  StyleSheet,
  View,
  RefreshControl,
  TouchableOpacity,
  Image,
  
} from "react-native";
import { Icon } from "@ui-kitten/components";
const Stack = createStackNavigator();

const AppNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tab"
        component={AppTabNavigator}
        options={{ headerShown: false }} // Hide the header for the Tab.Navigator
      />
      <Stack.Screen
        name="Product"
        component={ProductScreen} // Your Product screen component
        
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;