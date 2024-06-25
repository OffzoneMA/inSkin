import React from "react";

import AppTabNavigator from "./appTab";
import { createStackNavigator, HeaderBackButton } from "@react-navigation/stack";
import NotificationScreen from "./NotificationScreen";
import home from "../screens/scan/addproduct";
import ProductScreen from "../screens/product/home"; // Importez votre composant d'écran de produit ici
import { useTheme } from "@ui-kitten/components";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tab"
        component={AppTabNavigator}
      //   options={{ headerShown: false }} // Hide the header for the Tab.Navigator
      // />
      // <Stack.Screen
      //   name="Product"
      //   component={ProductScreen} // Your Product screen component
      //   options={{
      //     title: 'Product',
      //     headerStyle: {
      //       backgroundColor: theme["background-basic-color-1"],
      //     },
      //     headerTintColor: theme["text-basic-color"],
      //     headerTitleStyle: {
      //       fontWeight: 'bold',
      //     },
      //   }}
      // />

        options={{ headerShown: false }} // Masquer l'en-tête pour le Tab.Navigator
      />
      <Stack.Screen
        name="Product"
        component={ProductScreen} // Votre composant d'écran de produit
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationScreen}
      />
     <Stack.Screen name="AddPublicationScreen" component={home} />
    </Stack.Navigator>
  );
};


export default AppNavigator;

