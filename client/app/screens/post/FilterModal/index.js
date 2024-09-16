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
import ReactNativeModal from 'react-native-modal';
import styles from './styles';
import AppText from '../../../components/AppText';
import { colors, images } from '../../../constants';
import { LocalesMessages } from '../../../constants/locales';
import AppButton from '../../../components/AppButton';
import AppTextInput from '../../../components/AppTextInput';
import { useTheme, Icon } from "@ui-kitten/components";
import TextInput from "../../../components/TextInput";
import Button from "../../../components/Button";

import brandActionsApi from "../../../api/brand_actions";

import productActionsApi from "../../../api/product_actions";

import AuthContext from "../../../contexts/auth";

import { ScanContext } from "../../../contexts/scan-context";

import { Formik } from 'formik';
import * as Yup from 'yup';

import { Dropdown } from 'react-native-element-dropdown';

import * as ImagePicker from "expo-image-picker";

const FilterModal = ({ isVisible = false, onPressClose, onApplyPress, listecategorie, onChangeText, barcode }) => {
  const [categoryList, setCategoryList] = useState(listecategorie || []);
  const [selectedCategory, setselectedCategory] = useState('');
  const [isCreatingNewBrand, setIsCreatingNewBrand] = useState(false);
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const [brandsNames, setBrandsNames] = useState([]);

  const addProductApi = useApi(productActionsApi.add_product);

  const { scanned, setScanned } = useContext(ScanContext);
  
  const [selected, setSelected] = useState("");

  const [selectedImages, setSelectedImages] = useState([]);

  const [isFocus, setIsFocus] = useState(false);
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
  
        // Add the extra item to the brandsNames array
        brandsNames.unshift({
          value: "",
          label: "No brand"
        });
  
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
      console.log(result);
      return;
    }
    //toast.show(result.data.message, {type: "success"});
    navigation.navigate("PostDetails")
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
        <Text style={[styles.selectedTextStyle, {color: theme["text-basic-color"]}]}>{item.label}</Text>
      </View>
    );
  };

  const handleImagePicker = async () => {
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
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
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'You need to enable camera roll access for selecting images.');
      }
    })();
  }, []); 

  // Fonction pour récupérer les catégories sélectionnées
  const getSelectedCategories = () => {
    return categoryList.filter(category => category.isSelected);
  };

  return (
    <ReactNativeModal
      isVisible={isVisible}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      hasBackdrop={true}
      
      backdropTransitionOutTiming={400}
      onBackdropPress={onPressClose}
      swipeDirection={'down'}
      onModalWillShow={() => {
        setselectedCategory(null);
      }}
      style={styles.modal}>
      <View style={styles.mainContainer}>
        <View style={styles.dividerTop} />
        <AppText
          text="Ajouter une marque de produit"
          size='font18px'
          style={styles.title}
          fontFamily='medium'
        />
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
                <AppTextInput
                  placeholderText="Code-barres"
                  value={values.barcode}
                  onChangeText={handleChange("barcode")}
                  errorMessage={errors.password}
                  onBlur={() => setFieldTouched("barcode")}
                  errorVisible={touched.barcode && errors.barcode}
                />
                 <AppTextInput
                  placeholderText="Entrez le nom de de produit"
                  value={values.name}
                  onChangeText={handleChange("name")}
                  errorMessage={errors.password}
                  onBlur={() => setFieldTouched("name")}
                  errorVisible={touched.name && errors.name}
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
                <Button title="OK" onPress={handleSubmit} style={{flex: 2, marginRight: 2,backgroundColor: colors.pink,}}>Ajouter un produit</Button>
                <Button onPress={onCancelClick} style={{flex: 1, marginLeft: 2, backgroundColor: "#8F9BB3", borderColor: "#8F9BB3"}}>Cancel</Button>
              </View>
            </View>
          )}
      </Formik>
        <AppButton
          localizedText={LocalesMessages.apply}
          buttonStyle={styles.confirmButton}
          labelStyle={[styles.confirmButtonText]}
          isDisable={!selectedCategory}
          onPress={() => {
            const selectedCategories = getSelectedCategories();
            onApplyPress(selectedCategories); // Transmettre les catégories sélectionnées
            onPressClose();
          }}
        />
      </View>
    </ReactNativeModal>
  );
};

export default FilterModal;
