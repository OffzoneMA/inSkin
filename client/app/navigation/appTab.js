import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BrowseNavigator from "./browse";
import ProfileNavigator from "./profile";
import ProfileNavigator1 from "./profile";
import SearchUser from "../screens/search/search";
import DiscoverHomeWithFollowers from "../screens/browse/homeWithFollowers";
import DiscoverHome1 from "../screens/browse/homeNoFollowers"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import postNavigator from "./post"
import NotificationScreen from "./NotificationScreen";
import ScanNavigator from "./scan";
import { useTheme ,Icon} from "@ui-kitten/components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView, Dimensions,View,Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import {renderProfileImage} from "../screens/profile/ProfilePicture";
import { encode } from 'base-64';
import { FountsEnum, Route, RouteNavigator } from '../constants/constants';
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native"; 
import { images ,colors } from '../constants';
import AppText from '../components/AppText';
import ScanButton from '../components/ScanButton';
import  FavoriteNavigator from './FavoriteNavigator';
import AddProduct from "../screens/scan/addproduct";
import ScanHome from "../screens/scan/home";
import MyPostNavigator from './MyPostNavigator';
import { ScanContext } from "../contexts/scan-context";
const BottomTab = createBottomTabNavigator();


const getTabBarTitle = (route) => {
  if (route === RouteNavigator.BrowseNavigator) {
    return 'Accueil'
  }
  if (route === RouteNavigator.SearchUser) {
    return 'Recherche'
  }
  if (route === RouteNavigator.FavoriteNavigator) {
    return 'Favoris'
  }
  if (route === RouteNavigator.DiscoverHome1) {
    return 'publication'
  }
  if (route === RouteNavigator.ProfileNavigator) {
    return 'Profil'
  }
}
const getTabBarIcon = (route, focused) => {
  let imageIcon = images.home
  if (route === RouteNavigator.BrowseNavigator) {
    imageIcon = images.home
  }
  if (route === RouteNavigator.SearchUser) {
    imageIcon = images.search
  }
  if (route === RouteNavigator.FavoriteNavigator) {
    imageIcon = images.favourite
  }
  if (route === RouteNavigator.DiscoverHome1) {
    imageIcon = images.myPost
  }
  if (route === RouteNavigator.ProfileNavigator) {
    imageIcon = images.profile
  }
  
  return (
    <View
      style={[
        styles.bottomTabIconContainer,
      ]}>
      <Image
        source={imageIcon}
        style={[
          styles.bottomTabIconImage,
          { tintColor: focused ? colors.pink : colors.tabBarGray },
        ]}
      />
      <AppText
        text={getTabBarTitle(route)}
        style={[styles.tabBarText, {
          color: focused ? colors.pink : colors.tabBarGray,
        }]}
      />
    </View>
  )
  
}
 const AppTabNavigator= () => {
  const navigation = useNavigation();

  const handleScanButtonPress = () => {
    console.log("scaaaaaaaaaaaaaaaan")
    navigation.navigate('ScanNavigator'); // Assurez-vous que 'AddProduct' est le nom correct de l'écran
  };
  
  
  return (
    <>
   <BottomTab.Navigator
        initialRouteName={Route.HomeScreen}
        screenOptions={({ route }) => {
          return {
            headerShown: false,
            tabBarStyle: styles.bottomTabContainer,
            title: '',
            tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused),
          }
        }}>
        <BottomTab.Screen name={RouteNavigator.BrowseNavigator} component={BrowseNavigator} />
        <BottomTab.Screen name={RouteNavigator.SearchUser} component={SearchUser} />
        <BottomTab.Screen name={RouteNavigator.FavoriteNavigator} component={FavoriteNavigator} />
        <BottomTab.Screen name={RouteNavigator.DiscoverHome1} component={MyPostNavigator} />
        <BottomTab.Screen name={RouteNavigator.ProfileNavigator} component={ProfileNavigator} />
      </BottomTab.Navigator>
      <ScanButton onPressButton={handleScanButtonPress}/>
      
      
  </>
  );
}
export default AppTabNavigator;
const styles = StyleSheet.create({
  bottomTabContainer: {
    backgroundColor: colors.white,
    height: 90,
    paddingTop: 30,
  },
  bottomTabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  bottomTabIconImage: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  tabBarText: {
    fontFamily: FountsEnum.PrimaryRegular,
    
  },
})
