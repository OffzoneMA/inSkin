import React, { useState, useContext } from "react";
import {
  StyleSheet,
} from "react-native";

import { useTheme } from '@ui-kitten/components';

import Page from "../../components/Page";
import Heading from "../../components/Heading";
import Button from "../../components/Button";


import AuthContext from "../../contexts/auth";
import authStorage from "../../utilities/authStorage";

import { useToast } from "react-native-toast-notifications";

function ProfileHome({ navigation }) {
  const authContext = useContext(AuthContext);

  const toast = useToast();

  const handleLogOut = () => {
    toast.show('Logout Successful', {type: "success"});

    setTimeout(() => {
      authContext.setUser(null);
      authStorage.removeToken();
          }, 300);
  };

  return (
    <Page>
      <Heading>Profile</Heading>
      <Button onPress={handleLogOut}>Log Out</Button>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default ProfileHome;
