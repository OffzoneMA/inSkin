import { StyleSheet, View, Text, Pressable, Alert, ScrollView } from "react-native";
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

import { Formik } from "formik";

import Modal from "react-native-modal";

// Components
import Page from "./Page";
import Heading from "./Heading";
import Paragraph from "./Paragraph";
import Button from "./Button";
import TextInput from "./TextInput";
import TextLink from "./TextLink";

const validationSchema = Yup.object({
  barcode: Yup.string().required().label("Barcode"),
  name: Yup.string().label("Name"),
  brands: Yup.string().label("Brands"),
  categories: Yup.string().label("Categories"),
  ingredients: Yup.string().label("Ingredients"),
});

export default function Cam({ flash, zoom }) {
  const addProductApi = useApi(productActionsApi.add_product);

  const theme = useTheme();

  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const { user } = useContext(AuthContext);

  const { qrcode, setQrcode } = useContext(ScanContext);

  const navigation = useNavigation();

  const [showCustomPopup, setShowCustomPopup] = useState(false); // State to control custom pop-up visibility

  const addScannedProduct = async ({
    barcode, // Initialize with the scanned QR code data
    userId,
    name,
    brands,
    categories,
    ingredients,
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
      barcode.trim(),
      userId,
      name.trim(),
      brands,
      categories,
      ingredients,
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

  const handleBarcodeScanned = (qr) => {
    setScanned(true);
    setQrcode({ date: new Date(), qr });
    setShowCustomPopup(true); // Show the custom pop-up
  };

  const handleOKPress = ({
    barcode,
    userId,
    name,
    brands,
    categories,
    ingredients,
  }) => {
    const brandsArray = brands.split(",").map((item) => item.trim()).filter((item) => item !== "");
    const categoriesArray = categories.split(",").map((item) => item.trim()).filter((item) => item !== "");
    const ingredientsArray = ingredients.split(",").map((item) => item.trim()).filter((item) => item !== "");

    setScanned(false); // Reset the scanned state
    addScannedProduct({
        barcode: barcode,
        userId: userId,
        name: name,
        brands: brandsArray, // Use the arrays instead of strings
        categories: categoriesArray,
        ingredients: ingredientsArray,
      }); // Handle the barcode submission using the stored barcode
    setShowCustomPopup(false); // Close the custom pop-up
  };

  // Function to close the custom pop-up
  const closeCustomPopup = () => {
    setScanned(false);
    setShowCustomPopup(false);
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
      {/* Bottom Modal */}
      <Modal
        isVisible={showCustomPopup}
        swipeDirection={["down"]}
        onSwipeComplete={() => setShowCustomPopup(false)}
        style={styles.bottomModal}
      >
        <View style={styles.bottomModalContent}>
        <Formik
          initialValues={{
            barcode: qrcode.qr ? qrcode.qr.data : "", // Initialize with the scanned QR code data
            userId: user._id,
            images: [""],
            name: "",
            brands: "",
            categories: "",
            ingredients: "",
          }}
          onSubmit={handleOKPress}
          validationSchema={validationSchema}
        >
          {({
            handleChange,
            handleSubmit,
            errors,
            setFieldTouched,
            touched,
            values,
          }) => (
            <ScrollView>
              <TextInput
                placeholder="Barcode"
                keyboardType="default"
                returnKeyType="next"
                autoCapitalize="none"
                value={values.barcode}
                onChangeText={handleChange("barcode")}
                errorMessage={errors.barcode}
                onBlur={() => setFieldTouched("barcode")}
                errorVisible={touched.barcode}
              />
              <TextInput
                placeholder="Product Name"
                keyboardType="default"
                returnKeyType="next"
                autoCapitalize="none"
                value={values.name}
                onChangeText={handleChange("name")}
                errorMessage={errors.name}
                onBlur={() => setFieldTouched("name")}
                errorVisible={touched.name}
              />
              <TextInput
                placeholder="Brands (comma-separated)"
                keyboardType="default"
                returnKeyType="next"
                autoCapitalize="none"
                value={values.brands} // Join the array as a comma-separated string
                onChangeText={handleChange("brands")}
                errorMessage={errors.brands}
                onBlur={() => setFieldTouched("brands")}
                errorVisible={touched.brands}
              />
              <TextInput
                placeholder="Categories (comma-separated)"
                keyboardType="default"
                returnKeyType="next"
                autoCapitalize="none"
                value={values.categories} // Join the array as a comma-separated string
                onChangeText={handleChange("categories")}
                errorMessage={errors.categories}
                onBlur={() => setFieldTouched("categories")}
                errorVisible={touched.categories}
              />
              <TextInput
                placeholder="Ingredients (comma-separated)"
                keyboardType="default"
                returnKeyType="next"
                autoCapitalize="none"
                value={values.ingredients} // Join the array as a comma-separated string
                onChangeText={handleChange("ingredients")}
                errorMessage={errors.ingredients}
                onBlur={() => setFieldTouched("ingredients")}
                errorVisible={touched.ingredients}
              />
              <View style={styles.buttonContainer}>
                <Button title="OK" style={styles.button} onPress={handleSubmit}>
                  Add Product
                </Button>
                <Button title="Cancel" style={styles.cancelButton} onPress={closeCustomPopup}>
                  Cancel
                </Button>
              </View>
            </ScrollView>
          )}
        </Formik>


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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    flex: 2,
    alignSelf: "flex-end",
    alignItems: "center",
    marginRight: 5,
  },
  cancelButton: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
    marginLeft: 5,
    backgroundColor: "gray",
    borderColor: "gray",
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
