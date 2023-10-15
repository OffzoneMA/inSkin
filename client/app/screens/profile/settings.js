import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  FlatList,
  StatusBar,
  RefreshControl,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";

import Page from "../../components/Page";
import Heading from "../../components/Heading";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import TextLink from "../../components/TextLink";
import Label from "../../components/Label";
import Caption from "../../components/Caption";
import SubHeading from "../../components/SubHeading";
import Paragraph from "../../components/Paragraph";

import productActionsApi from "../../api/product_actions";


function ProfileSettings({ navigation }) {

  return (
    <Page>
      <Heading>Settings</Heading>
    </Page>
  );
}

const styles = StyleSheet.create({

});

export default ProfileSettings;
