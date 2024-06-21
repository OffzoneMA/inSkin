import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AppTabNavigator from "./appTab";
import ProductScreen from "../screens/product/home"; // Import your Product screen component here
import { useTheme } from "@ui-kitten/components";

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
        options={{
          title: 'Product',
          headerStyle: {
            backgroundColor: theme["background-basic-color-1"],
          },
          headerTintColor: theme["text-basic-color"],
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;