import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";

import Page from "../../components/Page";

import { useTheme, Icon } from "@ui-kitten/components";

import TextInput from "../../components/TextInput";
import Button from "../../components/Button";

import brandActionsApi from "../../api/brand_actions";

import productActionsApi from "../../api/product_actions";

import AuthContext from "../../contexts/auth";

import { ScanContext } from "../../contexts/scan-context";

import { Formik } from 'formik';
import * as Yup from 'yup';

import { Dropdown } from 'react-native-element-dropdown';

import * as ImagePicker from "expo-image-picker";

const validationSchema = Yup.object({
  barcode: Yup.string().required().label('Barcode'),
  name: Yup.string().label('Name'),
  brand: Yup.string().label('Brand'),
  description: Yup.string().label('Description'),
});

function AddProduct({ navigation, route }) {

  const theme = useTheme();

  const { barcode } = route.params;

  const { user } = useContext(AuthContext);

  const [brandsNames, setBrandsNames] = useState([]);

  const addProductApi = useApi(productActionsApi.add_product);

  const { scanned, setScanned } = useContext(ScanContext);
  
  const [selected, setSelected] = useState("");

  const [selectedImages, setSelectedImages] = useState([]);

  const getAllBrands = async () => {
    try {
      const result = await brandActionsApi.getAllBrands();
      if (!result.ok) {
        //toast.show(result.data, { type: "danger" });
      } else {
        //toast.show(result.data.message, { type: "success" });
        const brandsNames = result.data.brands.map(brand => ({
          value: brand._id, // Use _id as the key
          label: brand.name // Use name as the value
        }));
        setBrandsNames(brandsNames);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const onCancelClick = () => {
    navigation.goBack();
  }

  const addScannedProduct = async ({
    barcode, // Initialize with the scanned QR code data
    userId,
    images,
    name,
    brand,
    description,
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
      images,
      name.trim(),
      brand === "" ? null : brand,
      description,
    );

    if (!result.ok) {
      //toast.show(result.data, {type: "danger"});
      console.log("danger");
      console.log(result);
      return;
    }

    //toast.show(result.data.message, {type: "success"});
    console.log("success");
    navigation.goBack();
  };

const handleOKPress = ({
    barcode,
    userId,
    name,
    brand,
    description,
  }) => {
    //const brandsArray = brands.split(",").map((item) => item.trim()).filter((item) => item !== "");

    setScanned(false); // Reset the scanned state
    
    addScannedProduct({
        barcode: barcode,
        userId: userId,
        images: selectedImages,
        name: name,
        brand: brand, // Use the arrays instead of strings
        description: description,
      }); // Handle the barcode submission using the stored barcode
  };

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        <Icon
          name="image-outline"
          width={24} // Set the width of the icon
          height={24} // Set the height of the icon
          fill={theme["color-basic-600"]} // Set the color of the icon
        />
      </View>
    );
  };

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uriParts = result.assets[0].uri.split('.');
      const fileExtension = uriParts[uriParts.length - 1];

      const image = {
        uri: result.assets[0].uri,
        type: 'image/' + fileExtension, // Dynamically set the image type based on the file extension
        name: 'image.' + fileExtension, // Dynamically set the file name with the extracted extension
      };

      const newImages = [...selectedImages, image];
      setSelectedImages(newImages);
    }
  };

  const removeImage = index => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };
  
  useEffect(() => {
    // Your function to run when the component is mounted
    getAllBrands();
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'You need to enable camera roll access for selecting images.');
      }
    })();
  }, []); // The empty array [] means this effect will only run once, equivalent to componentDidMount in class components

  return (
    <Page>
        <View>
        {selectedImages.length > 0 ? (
    <View style={{ maxHeight: 200 }}>
      <FlatList
        data={selectedImages}
        keyExtractor={(item, index) => index.toString()}
        horizontal={false}
        numColumns={3}
        renderItem={({ item, index }) => (
          <View style={{ marginVertical: 5, marginRight: 10 }}>
            <View style={{ position: 'relative' }}>
              <Image source={{ uri: item.uri }} style={{ width: 100, height: 100, borderRadius: 10 }} />
              <TouchableOpacity
                onPress={() => removeImage(index)}
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  backgroundColor: 'red',
                  padding: 5,
                  borderRadius: 50,
                  zIndex: 1,
                }}
              >
                <Text style={{ color: 'white' }}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity onPress={handleImagePicker}>
            <View style={{ marginVertical: 5, backgroundColor: 'blue', width: 100, height: 100, borderRadius: 10, backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
              <Icon name="plus-circle-outline" width={24} height={24} fill={theme['color-basic-600']} />
            </View>
          </TouchableOpacity>
        }
      />
    </View>
  ) : null}

      {selectedImages.length > 0 ? null : (
        <TouchableOpacity onPress={handleImagePicker}>
          <View style={{ marginVertical: 5, backgroundColor: 'blue', width: 100, height: 100, borderRadius: 10, backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
            <Icon name="image-outline" width={24} height={24} fill={theme['color-basic-600']} />
          </View>
        </TouchableOpacity>
      )}
    </View>
        
        
      <Formik
          initialValues={{
              barcode: barcode,
              userId: user ? user._id : "",
              name: "",
              brand: selected,
              description: "",
          }}
          onSubmit={handleOKPress}
          //validationSchema={validationSchema}
          >
          {({
              handleChange,
              handleSubmit,
              errors,
              setFieldTouched,
              touched,
              values,
              setFieldValue,
          }) => (
              <View>
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
                  placeholder="Name"
                  keyboardType="default"
                  returnKeyType="next"
                  autoCapitalize="none"
                  value={values.name}
                  onChangeText={handleChange("name")}
                  errorMessage={errors.name}
                  onBlur={() => setFieldTouched("name")}
                  errorVisible={touched.name}
              />
              <Dropdown
                style={[styles.dropdown, {backgroundColor: theme["background-basic-color-2"]}]}
                placeholderStyle={[styles.placeholderStyle, {color: theme["color-basic-600"]}]}
                selectedTextStyle={[styles.selectedTextStyle, {color: theme["text-basic-color"]}]}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={brandsNames}
                labelField="label"
                valueField="value"
                placeholder="Select brand"
                value={values.brand}
                search
                searchPlaceholder="Search..."
                onChange={item => {
                  setSelected(item.value);
                  setFieldValue("brand", item.value);
                }}
                renderLeftIcon={() => (
                  <Icon
                    name="image-outline"
                    width={24} // Set the width of the icon
                    height={24} // Set the height of the icon
                    fill={theme["color-basic-600"]} // Set the color of the icon
                  />
                )}
                renderItem={renderItem}
                renderSelectedItem={(item, unSelect) => (
                  <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                    <View style={styles.selectedStyle}>
                      <Text style={styles.textSelectedStyle}>{item.label}</Text>
                      <Icon
                        name="close-outline"
                        width={24} // Set the width of the icon
                        height={24} // Set the height of the icon
                        fill={theme["color-basic-600"]} // Set the color of the icon
                      />
                    </View>
                  </TouchableOpacity>
                )}
              />

              <TextInput
                textAlignVertical="top"
                maxHeight={100}
                multiline={true}
                numberOfLines={4}
                placeholder="Description..."
                keyboardType="default"
                returnKeyType="next"
                autoCapitalize="none"
                value={values.description}
                onChangeText={handleChange("description")}
                errorMessage={errors.description}
                onBlur={() => setFieldTouched("description")}
                errorVisible={touched.description}
              />
              <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                <Button title="OK" onPress={handleSubmit} style={{flex: 2, marginRight: 2}}>Add Product</Button>
                <Button onPress={onCancelClick} style={{flex: 1, marginLeft: 2, backgroundColor: "#8F9BB3", borderColor: "#8F9BB3"}}>Cancel</Button>
              </View>
              <Button onPress={() => console.log(selectedImages.length)} style={{flex: 1, margin: 20}}>test</Button>
            </View>
          )}
      </Formik>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  dropdown: {
    height: 50,
    borderRadius: 4,
    marginBottom: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 6,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginBottom: 10,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
});

export default AddProduct;
