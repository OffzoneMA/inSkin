import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import FavoriteNavigator from './FavoriteNavigator'
import HomeNavigator from './HomeNavigator'
import MyPostNavigator from './MyPostNavigator'
import ProfileNavigator from './ProfileNavigator'
import SearchNavigator from './SearchNavigator'
import { FountsEnum, Route, RouteNavigator } from '../constants/constants'
import { colors, images } from '../constants'
import AppText from '../components/AppText'
import ScanButton from '../components/ScanButton'

const BottomTab = createBottomTabNavigator()
const getTabBarTitle = (route) => {
  if (route === RouteNavigator.HomeNavigator) {
    return 'Home'
  }
  if (route === RouteNavigator.SearchNavigator) {
    return 'Search'
  }
  if (route === RouteNavigator.FavoriteNavigator) {
    return 'Favourite'
  }
  if (route === RouteNavigator.MyPostNavigator) {
    return 'My posts'
  }
  if (route === RouteNavigator.ProfileNavigator) {
    return 'Profile'
  }
}
const getTabBarIcon = (route, focused) => {
  let imageIcon = images.home
  if (route === RouteNavigator.HomeNavigator) {
    imageIcon = images.home
  }
  if (route === RouteNavigator.SearchNavigator) {
    imageIcon = images.search
  }
  if (route === RouteNavigator.FavoriteNavigator) {
    imageIcon = images.favourite
  }
  if (route === RouteNavigator.MyPostNavigator) {
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

const BottomTabNavigator = () => {
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
        <BottomTab.Screen name={RouteNavigator.HomeNavigator} component={HomeNavigator} />
        <BottomTab.Screen name={RouteNavigator.SearchNavigator} component={SearchNavigator} />
        <BottomTab.Screen name={RouteNavigator.FavoriteNavigator} component={FavoriteNavigator} />
        <BottomTab.Screen name={RouteNavigator.MyPostNavigator} component={MyPostNavigator} />
        <BottomTab.Screen name={RouteNavigator.ProfileNavigator} component={ProfileNavigator} />
      </BottomTab.Navigator>
      <ScanButton />
    </>
  )
}

export default BottomTabNavigator;

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
