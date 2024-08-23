import React, { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from 'react-native';
import * as eva from "@eva-design/eva";
import lightTheme from "./app/config/lightTheme";
import darkTheme from "./app/config/darkTheme";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { ThemeContext } from "./app/contexts/theme-context";
import {
  ApplicationProvider,
  IconRegistry,
} from "@ui-kitten/components";
import { NavigationContainer } from "@react-navigation/native";
import AuthContext from "./app/contexts/auth";
import authStorage from "./app/utilities/authStorage";
import * as SplashScreen from 'expo-splash-screen';

// Redux imports
import { Provider } from 'react-redux';
import { store } from "./app/redux/store"; // Assurez-vous que le chemin vers votre store est correct

// Navigation
import OnboardingNavigator from "./app/navigation/onboarding";
import AuthNavigator from "./app/navigation/auth";
import AppNavigator from "./app/navigation/appNav";
import SafeScreen from "./app/components/SafeScreen";
import OfflineNotice from "./app/components/OfflineNotice";

export default function App() {
  
  
  const [haveFontsLoaded] = useFonts({
    "Jost-Regular": require("./app/assets/fonts/Jost-Regular.ttf"),
    "Jost-SemiBold": require("./app/assets/fonts/Jost-SemiBold.ttf"),
    "Jost-Bold": require("./app/assets/fonts/Jost-Bold.ttf"),
    "Jost-ExtraBold": require("./app/assets/fonts/Jost-ExtraBold.ttf"),
    "Jost-ExtraLight": require("./app/assets/fonts/Jost-ExtraLight.ttf"),
    "Jost-Light": require("./app/assets/fonts/Jost-Light.ttf"),
    "Jost-Medium": require("./app/assets/fonts/Jost-Medium.ttf"),
    "Jost-Thin": require("./app/assets/fonts/Jost-Thin.ttf"),
    'Inter-Regular': require('./app/assets/fonts/Inter-Regular.ttf'),
    'regular': require('./app/assets/fonts/Inter-Regular.ttf'),
    'medium': require('./app/assets/fonts/Inter-Medium.ttf'),
    'semiBold': require('./app/assets/fonts/Inter-SemiBold.ttf'),
    'bold': require('./app/assets/fonts/Inter-Bold.ttf'),
    'extraBold': require('./app/assets/fonts/Inter-ExtraBold.ttf'),
  });

  const systemThemeStyle = useColorScheme();
  const [user, setUser] = useState();
  const [theme, setTheme] = useState(systemThemeStyle);
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState("Onboarding");

  const restoreUser = async () => {
    const user = await authStorage.getUser();
    if (user) setUser(user);
  };

  const computeInitialRoute = async () => {
    const value = await AsyncStorage.getItem("hasOnboarded");
    if (value) setInitialRoute("Auth");
  };

  const startUp = async () => {
    await SplashScreen.preventAutoHideAsync();
    await restoreUser();
    await computeInitialRoute();
    await SplashScreen.hideAsync();
    setIsReady(true);
  };

  useEffect(() => {
    startUp();
  }, []);

  if (haveFontsLoaded && isReady) {
    return (
      <Provider store={store}>
        <IconRegistry icons={EvaIconsPack} />
        <AuthContext.Provider value={{ user, setUser }}>
          <ThemeContext.Provider value={{ theme, setTheme }}>
            <ApplicationProvider
              {...eva}
              theme={
                theme == "light"
                  ? { ...eva.light, ...lightTheme }
                  : { ...eva.dark, ...darkTheme }
              }
            >
              <SafeScreen>
                  <OfflineNotice />
                  <NavigationContainer screenOptions={{ headerShown: false }}>
                    {user ? (
                      <AppNavigator />
                    ) : initialRoute == "Onboarding" ? (
                      <OnboardingNavigator />
                    ) : (
                      <AuthNavigator />
                    )}
                  </NavigationContainer>
                </SafeScreen>
            </ApplicationProvider>
          </ThemeContext.Provider>
        </AuthContext.Provider>
      </Provider>
    );
  }
  

  return null;
}
