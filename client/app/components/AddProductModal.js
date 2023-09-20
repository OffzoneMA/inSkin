import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import TextInput from './TextInput';
import Button from './Button';

import Modal from "react-native-modal";

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
  handleOKPress,
  qrcode,
  user,
  theme,
}) => {
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
