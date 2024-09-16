import { StyleSheet, View, Text ,TouchableOpacity} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useContext, useEffect } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { ScanContext } from "../contexts/scan-context";
import { Camera, CameraType } from 'expo-camera/legacy';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { TouchableNativeFeedback } from "react-native";

import Paragraph from "./Paragraph";

import { useTheme } from "@ui-kitten/components";

import Button from './Button';

export default function Cam({ flash, zoom }) {

  //const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const {scanned, setScanned} = useContext(ScanContext);

  const { setQrcode } = useContext(ScanContext);

  const theme = useTheme();
 console.log("scanned".scanned)
  const handleBarcodeScanned = ({ type, data }) => {
    setQrcode({ date: new Date(), data});
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };
  // Camera permissions are still loading
  if (!permission) return <View />;

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.modalBackground}>
        <View style={[styles.modalContainer, {backgroundColor: theme["background-basic-color-3"]}]}>
          <Paragraph style={{ textAlign: "center" }}>
            We need your permission to show the camera
          </Paragraph>
          <Button
            onPress={requestPermission}
            style={[styles.permissionBtn, {marginTop: 10, borderColor: theme["notification-success"], backgroundColor: theme["notification-success"]}]}
          >
            Grant permission
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
   
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarcodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
       
    <View style={styles.textContainer}>
      <Text style={styles.boldText}>
        Scanner le code-barres
      </Text>
      <Text style={styles.regularText}>
        {"\n"}Placez l'article correctement et prenez une photo.
      </Text>
      <Text style={styles.regularText}>
        {"\n"}L'intégralité du code-barres doit être dans le cadre.
      </Text>
    </View>
  </View>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: "center",
  aspectRatio: 3 / 4,
},
camera: {
  flex: 1,
},

textContainer: {
  position: 'absolute',
  bottom: 130,
  left: 10,
  right: 130,
  padding: 10,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  borderRadius: 10,
  alignItems: 'center',
},
boldText: {
  fontSize: 18,
  fontWeight: 'bold',
  color: 'white',
  textAlign: 'center',
},
regularText: {
  fontSize: 16,
  color: 'white',
  textAlign: 'center',
},
modalBackground: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
},
modalContainer: {
  borderRadius: 10,
  padding: 20,
  width: "80%", // Adjust the width as needed
  alignItems: "center",
},
permissionBtn: {
},
});