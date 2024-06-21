import React, { useState, useContext, useEffect, useLayoutEffect } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  RefreshControl,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import Page from "../components/Page";

import SubHeading from "../components/SubHeading";
import Paragraph from "../components/Paragraph";

import { useTheme, Icon } from "@ui-kitten/components";

import StarRating from 'react-native-star-rating-widget';

import { MaterialCommunityIcons } from "@expo/vector-icons";

import productActionsApi from "../api/product_actions";

import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation
import { useNavigation } from "@react-navigation/native";
import brandActionsApi from "../api/brand_actions";
import authApi from "../api/auth";

import AuthContext from "../contexts/auth";

import { encode } from 'base-64';

function NotificationScreen({ route }) {

  const theme = useTheme();
  const navigation = useNavigation();

  
  useEffect(() => {
    
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => handleShare()}>
            <MaterialCommunityIcons name='bell-outline' size={24} color='black' />
          </TouchableOpacity>
        ),
        
      });
    
  }, [navigation]);

  

  
  

 

  
  return (
    <Page>
      
      
      
      <View style={{ flexDirection: "column" }}>
        
           
        <View style={{ flexDirection: "row" }}>
       
        
        <Text style={{ flexDirection: "row" ,Color: 'black'}}></Text>
        <View style={{  flexDirection: "row" }}>
        
      </View>
      </View>
      
          
        
          
      </View>

      
      
      
    </Page>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: 'center',
    height: "100%",
    aspectRatio: 1,
    marginLeft: 5,
    borderRadius: 10, // Optional: Customize the border radius
  },
  text: {
    fontSize: 16,
    color: 'black', // Customize the text color
  },
  commentContainer: {
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default NotificationScreen;
