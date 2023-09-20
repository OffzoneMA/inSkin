import { StyleSheet, View, Text, Pressable, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useContext, useEffect } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { ScanContext } from "../contexts/scan-context";
import { Camera } from "expo-camera";

import { TouchableNativeFeedback } from "react-native";

import AuthContext from "../contexts/auth";

import * as Yup from "yup";

import { useTheme } from '@ui-kitten/components';

import productActionsApi from "../api/product_actions";
import useApi from "../hooks/useApi";

import AddProductModal from './AddProductModal';

const validationSchema = Yup.object({
  barcode: Yup.string().required().label("Barcode"),
  name: Yup.string().label("Name"),
  brands: Yup.string().label("Brands"),
  categories: Yup.string().label("Categories"),
  ingredients: Yup.string().label("Ingredients"),
});

export default function Cam({ flash, zoom }) {

  const [permission, requestPermission] = Camera.useCameraPermissions();
  const {scanned, setScanned} = useContext(ScanContext);

  const { setQrcode } = useContext(ScanContext);

  const navigation = useNavigation();

  const [showCustomPopup, setShowCustomPopup] = useState(false); // State to control custom pop-up visibility

  const handleBarcodeScanned = (qr) => {
    setScanned(true);
    setQrcode({ date: new Date(), qr });
    setShowCustomPopup(true); // Show the custom pop-up
  };

  // Function to close the custom pop-up
  const closeCustomPopup = () => {
    setScanned(false);
    setShowCustomPopup(false);
  };

  // Camera permissions are still loading
  if (!permission) return <View />;

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionDialogBox}>
          <Text style={{ fontSize: 20, textAlign: "center", color: "red" }}>
            We need your permission to show the camera
          </Text>
          <TouchableNativeFeedback
            onPress={requestPermission}
          >
            <View style={styles.permissionBtn}>
              <Text
                style={{ textAlign: "center", fontSize: 18, color: "#fff" }}
              >
                Grant permission
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        flashMode={flash}
        zoom={zoom}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
        onBarCodeScanned={scanned ? undefined : handleBarcodeScanned}
      >
        <View />
      </Camera>
      {/* Bottom Modal */}
      {/* Use the BarcodeScannerModal component */}
      <AddProductModal
        showCustomPopup={showCustomPopup}
        setShowCustomPopup={setShowCustomPopup}
        closeCustomPopup={closeCustomPopup}
      />
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
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  permissionContainer: {
    flex: 1,
    borderColor: "red",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionDialogBox: {
    padding: 10,
    backgroundColor: "#CED0FF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    gap: 40,
    width: "100%",
  },
  permissionBtn: {
    padding: 10,
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: "#00A86B",
  },
  customPopup: {
    position: "absolute",
    top: "10%",
    left: "10%",
    right: "10%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    zIndex: 1, // Make sure the pop-up is above the camera view
  },
});
