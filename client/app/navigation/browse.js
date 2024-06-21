import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
<<<<<<< HEAD
import BrowseHome from "../screens/browse/homeNoFollowers";
import SafeScreen from "../components/SafeScreen";
import SearchUser from "../screens/search/search";
import DiscoverHomeWithFollowers from "../screens/browse/homeWithFollowers";
import PostDetails from "../screens/post/postDetails";
import BrowseHome from "../screens/browse/home";
=======

import BrowseHome from "../screens/browse/homeNoFollowers";
>>>>>>> aichaBranch
import SafeScreen from "../components/SafeScreen";
import SearchUser from "../screens/search/search";
import DiscoverHomeWithFollowers from "../screens/browse/homeWithFollowers";
import PostDetails from "../screens/post/postDetails";

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
        

      </Stack.Navigator>
  );
}
