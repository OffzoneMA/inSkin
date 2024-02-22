import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Spinner } from "@ui-kitten/components";
import SubHeading from "./SubHeading";

export default function CustomButton({ children, loading = false, disabled = false, ...props }) {
  const LoadingIndicator = (props) => (
    <View style={styles.indicator}>
      <Spinner status="basic" size='small'/>
    </View>
  );

  const ButtonText = ({children, loading}) => {
    if(loading) return null
    return <SubHeading style={styles.buttonTextStyle}>{children}</SubHeading>
  };

  return (
    <Button
      children={ButtonText({children, loading})}
      accessoryLeft={loading ? LoadingIndicator : null}
      disabled={disabled} // Utilisation de la propriété disabled
      style={[styles.button, disabled ? styles.disabledButton : null]} // Application du style du bouton désactivé si disabled est true
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  buttonTextStyle: {
    fontSize: 14,
    textTransform: 'uppercase',
    color: 'white'
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    // Style du bouton actif
  },
  disabledButton: {
    backgroundColor: '#CCCCCC', // Couleur de fond lorsque le bouton est désactivé
  },
  disabledButtonText: {
    color: '#999999', // Couleur du texte lorsque le bouton est désactivé
  },
});
