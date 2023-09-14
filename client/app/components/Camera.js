import { Button, StyleSheet, View, Text, Pressable, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useContext, useEffect } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { ScanContext } from "../contexts/scan-context";
import { Camera } from "expo-camera";

import AlertBox from "./AlertBox";
import { TouchableNativeFeedback } from "react-native";

import AuthContext from "../contexts/auth";

import * as Yup from "yup";

import Toast from "react-native-root-toast";
import { useTheme } from '@ui-kitten/components';

import productActionsApi from "../api/product_actions";
import useApi from "../hooks/useApi";
import authStorage from "../utilities/authStorage";

const validationSchema = Yup.object({
  barcode: Yup.string().required().label("Barcode"),
});

export default function Cam({ flash, zoom }) {
  const addProductApi = useApi(productActionsApi.add_product);

  const theme = useTheme();

  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const { user } = useContext(AuthContext);

  const { setQrcode } = useContext(ScanContext);

  const navigation = useNavigation();

  const addScannedProduct = async ({
    barcode,
  }) => {
    var readerType;
    var readerGoals;
    var readerGenres;
    try {
      readerType = route.params.readerType;
      readerGoals = route.params.readerGoals;
      readerGenres = route.params.readerGenres;
    } catch (e) {
      readerType = null;
      readerGoals = [];
      readerGenres = [];
    }

    const result = await addProductApi.request(
      barcode,
    );

    if (!result.ok) {
      Toast.show(result.data, {
        duration: Toast.durations.SHORT,
        backgroundColor: theme["notification-error"],
      });

      return;
    }

    Toast.show(result.data.message, {
      duration: Toast.durations.SHORT,
      backgroundColor: theme['notification-success'],
    });
/* 
    setTimeout(() => {
      AsyncStorage.setItem("hasOnboarded", "true");
      var { user } = jwt_decode(result.headers["bearer-token"]);
      authContext.setUser(user);
      authStorage.storeToken(result.headers["bearer-token"]);

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    }, 300);
*/
  };

  const handleBarcodeScanned = (qr) => {
    setScanned(true);
    setQrcode({ date: new Date(), qr });
    Alert.alert("Alert Title", qr.data /* user.firstName */, [
      {
        text: "OK",
        onPress: () => {
          setScanned(false);
          addScannedProduct({ barcode: qr.data });
        }, // Set 'scanned' to false when OK is clicked
      },
    ]);
  };
/* 
  useEffect(() => {
    if (scanned) {
      if (scanned) navigation.push("Details");
    }
  }, [scanned]);
 */
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
  buttonContainer: {
    padding: 10,
    backgroundColor: "red",
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
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
});
