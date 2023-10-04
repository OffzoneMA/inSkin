import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AppTabNavigator from "./appTab";
import ProductScreen from "../screens/product/home"; // Import your Product screen component here

const Stack = createStackNavigator();

const AppNavigator = () => {
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