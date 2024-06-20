import React, { useState, useEffect } from "react";

import { Provider } from "react-redux";
import { store } from "./app/redux/store";
import i18n from "i18n-js";
import * as RNLocalize from "react-native-localize";

// import { LocalizationProvider } from "./app/contexts/LocalizationContext";
import { LocalizationContext } from "./app/contexts/LocalizationContext";


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
import * as SplashScreen from 'expo-splash-screen'; // Import SplashScreen

// Navigation
import OnboardingNavigator from "./app/navigation/onboarding";
import AuthNavigator from "./app/navigation/auth";
import AppNavigator from "./app/navigation/appNav";
import SafeScreen from "./app/components/SafeScreen";
import OfflineNotice from "./app/components/OfflineNotice";
//import { ToastProvider } from 'react-native-toast-notifications'

export default function App() {


  i18n.fallbacks = true;

  i18n.translations = {
    en: require("./app/localization/translation/en.json"),
    fr: require("./app/localization/translation/fr.json"),
  };

  const fallback = { languageTag: "en" };
  const { languageTag } =
    RNLocalize.findBestAvailableLanguage(["en", "fr"]) || fallback;

  const [locale, setLocale] = React.useState(languageTag);

  const localizationContext = React.useMemo(
    () => ({
      translate: (scope, options) => i18n.t(scope, { locale, ...options }),
      locale,
      setLocale,
    }),
    [locale]
  );

  const handleLocalizationChange = () => {
    const { languageTag } =
      RNLocalize.findBestAvailableLanguage(["en", "fr"]) || fallback;
    setLocale(languageTag);
  };

  React.useEffect(() => {
    RNLocalize.addEventListener("change", handleLocalizationChange);
    return () => {
      RNLocalize.removeEventListener("change", handleLocalizationChange);
    };
  }, []);
  if (!fontsLoaded) {
    <></>
  }




  const [haveFontsLoaded] = useFonts({
    "Jost-Regular": require("./app/assets/fonts/Jost-Regular.ttf"),
    "Jost-SemiBold": require("./app/assets/fonts/Jost-SemiBold.ttf"),
    "Jost-Bold": require("./app/assets/fonts/Jost-Bold.ttf"),
    "Jost-ExtraBold": require("./app/assets/fonts/Jost-ExtraBold.ttf"),
    "Jost-ExtraLight": require("./app/assets/fonts/Jost-ExtraLight.ttf"),
    "Jost-Light": require("./app/assets/fonts/Jost-Light.ttf"),
    "Jost-Medium": require("./app/assets/fonts/Jost-Medium.ttf"),
    "Jost-Thin": require("./app/assets/fonts/Jost-Thin.ttf"),
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
      
  };

  const startUp = async () => {
    // Prevent the splash screen from auto-hiding
    await SplashScreen.preventAutoHideAsync();

    await restoreUser();
    await computeInitialRoute();

    // Use SplashScreen to hide the splash screen
    await SplashScreen.hideAsync();

    setIsReady(true);
  };

  useEffect(() => {
    startUp(); // Call startUp when the component mounts
  }, []);

  if (haveFontsLoaded && isReady) {
    return (
      <>
      <LocalizationContext.Provider value={localizationContext}>
        <IconRegistry icons={EvaIconsPack} />
        <Provider store={store}>
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
              {/* <ToastProvider
                placement="bottom"
                successColor="#71B515"
                dangerColor="#DB2E5E"
                duration={3000}
                swipeEnabled={true}
              > */}
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
              {/* </ToastProvider> */}
            </ApplicationProvider>
          </ThemeContext.Provider>
        </AuthContext.Provider>
        </Provider>
        </LocalizationContext.Provider>
      </>
    );
  }

  return null; // Return null while loading
}
