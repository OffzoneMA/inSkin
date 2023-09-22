import React from 'react';
import { ScrollView, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import TextInput from './TextInput';
import Button from './Button';

import Modal from "react-native-modal";

import { useContext } from "react";
import AuthContext from "../contexts/auth";
import { ScanContext } from "../contexts/scan-context";
import productActionsApi from "../api/product_actions";

import { useToast } from "react-native-toast-notifications";

const validationSchema = Yup.object({
  barcode: Yup.string().required().label('Barcode'),
  name: Yup.string().label('Name'),
  brands: Yup.string().label('Brands'),
  categories: Yup.string().label('Categories'),
  ingredients: Yup.string().label('Ingredients'),
});

const AddProductModal = ({
  showCustomPopup,
  closeCustomPopup,
  setShowCustomPopup,
}) => {
    const { user } = useContext(AuthContext);
    const { setScanned} = useContext(ScanContext);
    const { qrcode } = useContext(ScanContext);
    const addProductApi = useApi(productActionsApi.add_product);

    const toast = useToast();

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
          toast.show(result.data, {type: "danger"});
          return;
        }
    
        toast.show(result.data.message, {type: "success"});
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

    return (
        <Modal
        isVisible={showCustomPopup}
        swipeDirection={["down"]}
        onSwipeComplete={closeCustomPopup}
        style={styles.modal}
        >
        <View style={styles.modalContent}>
            <Formik
            initialValues={{
                barcode: qrcode.qr ? qrcode.qr.data : "",
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
    );
};

const styles = {
  modal: {
    // Your modal styles
  },
  modalContent: {
    // Your modal content styles
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
};

export default AddProductModal;
