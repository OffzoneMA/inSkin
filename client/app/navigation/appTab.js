import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BrowseNavigator from "./browse";
import ProfileNavigator from "./profile";

import ProfileNavigator1 from "./profile";
import ProfileNavigator from "./ProfileNavigator";

import SearchUser from "../screens/search/search";
import DiscoverHomeWithFollowers from "../screens/browse/homeWithFollowers";
import ScanNavigator from "./scan";
import { useTheme ,Icon} from "@ui-kitten/components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView, Dimensions,View,Text, Image } from "react-native";
import { useState } from "react";
import {renderProfileImage} from "../screens/profile/ProfilePicture"
import { encode } from 'base-64';
import { useFocusEffect } from "@react-navigation/native"; 
import postNavigator from "./post"
import NotificationScreen from "./NotificationScreen";
import ScanNavigator from "./scan";
import { useTheme ,Icon} from "@ui-kitten/components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView, Dimensions,View,Text, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import {renderProfileImage} from "../screens/profile/ProfilePicture"
import { encode } from 'base-64';
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native"; 
import { images } from '../constants';
const Tab = createMaterialTopTabNavigator();

export default function AppTabNavigator() {
  const theme = useTheme();
  const windowWidth = Dimensions.get('window').width; 
  const navigation = useNavigation(); 
  const renderHeaderLogo = () => (
    <Text style={{ color: theme["color-primary-default"], fontSize: 20, fontWeight: 'bold' }}>INSKIN</Text>
  );
  const renderProfileImage1=()=>(
    <View>
    {renderProfileImage()} 
  </View>
  )
  // Fonction pour afficher l'icône de notification dans l'entête
  const renderNotificationIcon = () => (
    <MaterialCommunityIcons name='bell-outline' size={30} color='black' />
  );
  
  // Fonction pour afficher la photo de profil dans l'entête
  
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10,backgroundColor:'white'}}>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    {renderHeaderLogo()}
  </View>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    {renderProfileImage1()}
    {renderNotificationIcon()}
  </View>
</View>
      <Tab.Navigator
        initialRouteName="Home"
        backBehavior="none"
        tabBarPosition="bottom" // Position the tabBar at the bottom
        tabBarOptions={{
          activeTintColor: theme["color-primary-default"],
          inactiveTintColor: 'black',
          showIcon: true, // Show icons in tabs
          labelStyle: {
            fontSize: 12,
            fontWeight: "bold", // Make the tab labels bold
            marginVertical: 0,
          },
          indicatorStyle: {
            backgroundColor: theme["color-primary-default"], // Color of the active tab indicator
          },
          iconStyle: {
            marginVertical: 0, // Remove vertical margin
          },
          style: {
            backgroundColor:' #F4F4F4',
            width: windowWidth, // Set the tabBar width to window width
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={BrowseNavigator}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchUser}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons
                name={focused ? "magnify-expand" : "magnify-expand"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Favoris"
          component={DiscoverHomeWithFollowers}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons
                name={focused ? "heart" : "heart-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Posts"
          component={BrowseNavigator}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons
                name={focused ? "file-document-edit" : "file-document-edit-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileNavigator}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons
                name={focused ? "account-outline" : "account-outline"}
                size={24}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
