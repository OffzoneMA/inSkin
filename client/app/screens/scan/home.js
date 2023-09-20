import * as ImagePicker from "expo-image-picker";

import { View, StyleSheet, Pressable, Text, Button} from "react-native";
import { useState, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { ScanContext } from "../../contexts/scan-context";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import Slider from "@react-native-community/slider";
import AlertBox from "../../components/AlertBox";
import Navbar from "../../components/Navbar";
import Cam from "../../components/Camera";

import AuthContext from "../../contexts/auth";
import * as Yup from "yup";

import Toast from "react-native-root-toast";
import { useTheme } from '@ui-kitten/components';

import productActionsApi from "../../api/product_actions";
import useApi from "../../hooks/useApi";
import authStorage from "../../utilities/authStorage";

const validationSchema = Yup.object({
  barcode: Yup.string().required().label("Barcode"),
});

export default function Home({ navigation }) {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [alertBox, setAlertBox] = useState(null);
  const [isFocus, setFocus] = useState(false);
  const [value, setValue] = useState(0);

  const { qrcode, setQrcode } = useContext(ScanContext);

  const { user } = useContext(AuthContext);

  const [showCustomPopup, setShowCustomPopup] = useState(false); // State to control custom pop-up visibility

  const addProductApi = useApi(productActionsApi.add_product);

  const theme = useTheme();

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
  };

  const toggleFlashlight = async () => {
    setFlashlightOn(!flashlightOn);
  };

  async function scanQRCodeFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });
      if (!result.canceled) {
        const scanResult = await BarCodeScanner.scanFromURLAsync(
          result.assets[0].uri
        );
        if (scanResult.length > 0) {
          setQrcode({ date: new Date(), qr: scanResult[0] });
          setShowCustomPopup(true); // Show the custom pop-up
          //navigation.navigate("Details");
        } else {
          setAlertBox("No qr-code found");
        }
      }
    }
    if (status !== "granted") {
      setAlertBox("File permission is required to scan qr-code from photo.");
    }
    setTimeout(() => {
      setAlertBox(null);
    }, 5000);
  }

  const handleOKPress = () => {
    addScannedProduct({ barcode: qrcode.qr.data }); // Handle the barcode submission using the stored barcode
    setShowCustomPopup(false); // Close the custom pop-up
  };

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      setFocus(true);
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        setFocus(false);
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      {alertBox && <AlertBox message={alertBox} />}

      {isFocus && <Cam flash={flashlightOn ? 2 : 0} zoom={value} />}
      <View style={styles.topMask}/>
      <View style={styles.bottomMask}/>
      <View style={styles.rightMask}/>
      <View style={styles.leftMask}/>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          step={0.1}
          value={value}
          onValueChange={(newValue) => setValue(newValue)}
          minimumTrackTintColor="white"
          maximumTrackTintColor="white"
          thumbTintColor="white"
        />
      </View>

      <View style={styles.footer}>
          <Pressable style={styles.iconContainer} onPress={toggleFlashlight}>
            <View>
              {flashlightOn ? (
                <Ionicons name="flash" size={25} color="yellow" />
              ) : (
                <Ionicons name="flash-off" size={25} color="white" />
              )}
            </View>
          </Pressable>
          <View style={styles.separator}></View>
          <Pressable
            style={styles.iconContainer}
            onPress={scanQRCodeFromGallery}
          >
            <View>
              <MaterialIcons name="photo" size={25} color="white" />
            </View>
          </Pressable>

      </View>
      {/* Custom Pop-up */}
      {showCustomPopup && (
        <View style={styles.customPopup}>
          <Text style={styles.modalTitle}>{qrcode.qr.data}</Text>
          <Text>{qrcode.data}</Text>
          <Button title="OK" onPress={handleOKPress} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DBDCFF",
  },
  footer: {
    flexDirection: 'row',
    width: "60%",
    height: "9%",
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: "absolute",
    bottom: 30,
    borderRadius: 50,
    alignSelf: 'center',
    zIndex: 10,
  },
  actionsContainer: {
    backgroundColor: "#DBDCFF",
    borderTopWidth: 3,
    borderColor: "#CED0FF",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  separator: {
    width: 1, // Adjust the width of the white line as needed
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    height: "50%",
    alignSelf: "center",
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    padding: 10,
    paddingVertical: 16,
  },
  primeAction: {
    padding: 10,
    position: "absolute",
    left: "50%",
    bottom: 20,
    transform: [{ translateX: -40 }],
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: 80,
    height: 80,
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, // For Android
  },
  sliderContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: "50%",
    left: "42.5%",
    height: 50,
    zIndex: 10,
    overflow: "visible",
    transform:[{rotate: "-90deg"}],
  },
  slider: {
    width: "80%",
    zIndex: -1,
  },
  value: {
    fontSize: 20,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  scanMessage: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    padding: 20,
  },
  alertBox: {},
  customPopup: {
    position: "absolute",
    top: "40%",
    left: "10%",
    right: "10%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    zIndex: 1, // Make sure the pop-up is above the camera view
  },
  topMask: {
    width: "70%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    height: "27.5%",
    zIndex: 10,
    overflow: "visible",
    backgroundColor:'rgba(0, 0, 0, 0.2)',
  },
  bottomMask: {
    width: "70%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    height: "35%",
    zIndex: 10,
    overflow: "visible",
    backgroundColor:'rgba(0, 0, 0, 0.2)',
    bottom: 0,
  },
  rightMask: {
    width: "15%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 0,
    height: "100%",
    zIndex: 10,
    overflow: "visible",
    backgroundColor:'rgba(0, 0, 0, 0.2)',
    top: 0,
  },
  leftMask: {
    width: "15%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
    height: "100%",
    zIndex: 10,
    overflow: "visible",
    backgroundColor:'rgba(0, 0, 0, 0.2)',
    top: 0,
  },
});
