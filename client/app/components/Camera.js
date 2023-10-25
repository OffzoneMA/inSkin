import { StyleSheet, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useContext, useEffect } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { ScanContext } from "../contexts/scan-context";
import { Camera } from "expo-camera";

import { TouchableNativeFeedback } from "react-native";

import productActionsApi from "../api/product_actions";

import Modal from "react-native-modal";

import Button from "./Button";

export default function Cam({ flash, zoom }) {

  const [permission, requestPermission] = Camera.useCameraPermissions();
  const {scanned, setScanned} = useContext(ScanContext);

  const { qrcode, setQrcode } = useContext(ScanContext);

  const navigation = useNavigation();

  const [showCustomPopup, setShowCustomPopup] = useState(false); // State to control custom pop-up visibility

  const [ scannedProduct, setScannedProduct ] = useState(null);

  const getProductByBarcode = async (barcode) => {
    try {
      const result = await productActionsApi.getProductByBarcode(barcode);
  
      if (result.ok) {
        // Handle the case when result is ok
        setScannedProduct(result.data);
        navigation.navigate('Product', { product: result.data });
        setScanned(false);
      } else {
        // Handle the case when result is not ok
        setShowCustomPopup(true);
      }
  
    } catch (error) {
      console.error("Error getting product data: ", error);
    }
  };  

  const handleBarcodeScanned = (qr) => {
    setQrcode({ date: new Date(), qr });
    getProductByBarcode(qr.data);
  };

  // Function to close the custom pop-up
  const toggleCustomPopup = () => {
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={showCustomPopup}
        onRequestClose={toggleCustomPopup}
      >
        <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 10, backgroundColor: "white", borderRadius: 10, height: 100}}>
          <Text>This product doesn't exist!</Text>
          <Text>Would you like to add it?</Text>
          <View style={{flexDirection: "row"}}>
            <Button style={{flex: 1, marginRight: 2}}title="Close"
              onPress={() => {
                toggleCustomPopup();
                navigation.navigate("AddProduct", {barcode: qrcode.qr.data})
              }}
            >
              Yes
            </Button>
            <Button style={{flex: 1, marginLeft: 2}}title="Close" onPress={toggleCustomPopup}>
              No
            </Button>
          </View>
        </View>
      </Modal>
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
