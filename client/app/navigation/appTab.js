import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BrowseNavigator from "./browse";
import ProfileNavigator from "./profile";
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
    <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
      <MaterialCommunityIcons name='bell-outline' size={40} color='black' />
    </TouchableOpacity>
  );
  
  
  
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      
      <View style={{ flex: 1 }}>
        <Tab.Navigator
          initialRouteName="Home"
          backBehavior="none"
          tabBarPosition="bottom"
          tabBarOptions={{
            activeTintColor: theme["color-primary-default"],
            inactiveTintColor: 'black',
            showIcon: true,
            labelStyle: {
              fontSize: 12,
              fontWeight: "bold",
              marginVertical: 0,
            },
            indicatorStyle: {
              backgroundColor: theme["color-primary-default"],
            },
            iconStyle: {
              marginVertical: 0,
            },
            style: {
              backgroundColor: '#F4F4F4',
              width: windowWidth,
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
            component={BrowseNavigator}
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
            component={postNavigator}
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
            component={postNavigator}
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
       <TouchableOpacity 
          style={{
            position: 'absolute',
            bottom: 70, // Adjust as necessary
            right: (windowWidth / 2) - 180, // Center horizontally
            width: 60, // Adjust as necessary
            height: 60, // Adjust as necessary
            borderRadius: 30, // Half of width and height to make it a circle
            backgroundColor: 'pink',
            justifyContent: 'center',
            alignItems: 'center',
            
          }}
        >
          
          <Image
            source={images.scanner}
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity> 
      </View>
    </SafeAreaView>
  );
}