import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BrowseHome from "../screens/browse/home";
import SafeScreen from "../components/SafeScreen";
import SearchUser from "../screens/search/search";
import DiscoverHomeWithFollowers from "../screens/browse/homeWithFollowers";
import PostDetails from "../screens/post/postDetails";
import FeedDetailScreen from '../screens/FeedDetailScreen'
import { Route, RouteNavigator } from '../constants/constants'
const Stack = createStackNavigator();
export default function BrowseNavigator() {
  return (
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="BrowseHome"
      >
        <Stack.Screen name="BrowseHome" component={BrowseHome} />
        <Stack.Screen name="SearchUser" component={SearchUser} />
        <Stack.Screen name="DiscoverHomeWithFollowers" component={DiscoverHomeWithFollowers} />
        <Stack.Screen name="PostDetails" component={PostDetails} />
        <Stack.Screen name={Route.FeedDetailScreen} component={FeedDetailScreen} />
        

      </Stack.Navigator>
  );
}
