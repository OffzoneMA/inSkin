import React from "react";
import ScanHome from "../screens/scan/home";
import AppTabNavigator from "./appTab";
import { createStackNavigator, HeaderBackButton } from "@react-navigation/stack";
import NotificationScreen from "./NotificationScreen";
import home from "../screens/scan/addproduct";
import ProductScreen from "../screens/product/home"; // Importez votre composant d'écran de produit ici
import { useTheme } from "@ui-kitten/components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Route, RouteNavigator } from '../constants/constants'
import ScanNavigator from "./scan";
import SearchScreen from '../screens/SearchScreen'
import NotificationListScreen from '../screens/NotificationListScreen'
import WebViewScreen from '../screens/WebViewScreen'
const Stack = createStackNavigator();

const AppNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={RouteNavigator.AppTabNavigator}
      screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name={RouteNavigator.AppTabNavigator} component={AppTabNavigator} />
      <Stack.Screen
        name="Product"
        component={ProductScreen} // Votre composant d'écran de produit
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationScreen}
      />
      <Stack.Screen
        name="ScanNavigator"
        component={ScanNavigator}
      />
     <Stack.Screen name="AddPublicationScreen" component={home} />
     <Stack.Screen name="AddProduct" component={home} />
     <Stack.Screen name={Route.SearchScreen} component={SearchScreen} />
     <Stack.Screen name={Route.NotificationListScreen} component={NotificationListScreen} />
     <Stack.Screen name={Route.WebViewScreen} component={WebViewScreen} />
    </Stack.Navigator>
  );
};


export default AppNavigator;


