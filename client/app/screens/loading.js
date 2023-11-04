import React from "react";
import { StyleSheet } from "react-native";

import Page from "../components/Page";
import ActivityIndicator from "../components/ActivityIndicator";

function LoadingScreen({ navigation }) {
  return (
    <Page withPadding={false}>
      <ActivityIndicator visible={true} />
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default LoadingScreen;
