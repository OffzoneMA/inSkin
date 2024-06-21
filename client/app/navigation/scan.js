import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ScanHome from "../screens/scan/home";
import AddProduct from "../screens/scan/addproduct";

import { AppProvider } from "../contexts/scan-context";

const Stack = createStackNavigator();

export default function ShelfNavigator() {
  return (
    <AppProvider>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
        <Stack.Screen
          name="ScanHome"
          options={{ title: "Scan" }}
          component={ScanHome}
        />
        <Stack.Screen
          name="AddProduct"
          options={{ title: "Add Product" }}
          component={AddProduct}
        />
      
    </Stack.Navigator>
    </AppProvider>
  );
}
