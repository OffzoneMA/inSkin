import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ScanHome from "../screens/scan/home";

import { AppProvider } from "../contexts/Contexts";

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
      
    </Stack.Navigator>
    </AppProvider>
  );
}
