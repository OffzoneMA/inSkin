import React, { useState, useEffect, useContext } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";

import Page from "../../components/Page";
import Heading from "../../components/Heading";

import { useTheme, Icon, Input } from "@ui-kitten/components";

import { MultipleSelectList } from 'react-native-dropdown-select-list'

import TextInput from "../../components/TextInput";
import Button from "../../components/Button";

import brandActionsApi from "../../api/brand_actions";

import productActionsApi from "../../api/product_actions";

import AuthContext from "../../contexts/auth";

import { ScanContext } from "../../contexts/scan-context";

import { Formik } from 'formik';
import * as Yup from 'yup';

//import MultiSelect from 'react-native-multiple-select';

import { MultiSelect } from 'react-native-element-dropdown';

const validationSchema = Yup.object({
  barcode: Yup.string().required().label('Barcode'),
  name: Yup.string().label('Name'),
  brands: Yup.array().of(Yup.string()).label('Brands'),
  description: Yup.string().label('Description'),
});

function AddProduct({ navigation, route }) {

  const theme = useTheme();

  const { barcode } = route.params;

  const [selectedBrandsIds, setSelectedBrandsIds] = useState("");

  const { user } = useContext(AuthContext);

  const [brandsNames, setBrandsNames] = useState([]);

  const addProductApi = useApi(productActionsApi.add_product);

  const { scanned, setScanned } = useContext(ScanContext);

  const [selectedItems, setselectedItems] = useState(["1", "2"]);

  const [value, setValue] = useState(null);
  
  const [selected, setSelected] = useState([]);

  /* const data = [
    {key:'1', value:'Mobiles', disabled:true},
    {key:'2', value:'Appliances'},
    {key:'3', value:'Cameras'},
    {key:'4', value:'Computers', disabled:true},
    {key:'5', value:'Vegetables'},
    {key:'6', value:'Diary Products'},
    {key:'7', value:'Drinks'},
  ] */

  const items = [
    {id:'1', name:'Mobiles'},
    {id:'2', name:'Appliances'},
    {id:'3', name:'Cameras'},
    {id:'4', name:'Computers'},
    {id:'5', name:'Vegetables'},
    {id:'6', name:'Diary Products'},
    {id:'7', name:'Drinks'},
  ];

  const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];

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
    name,
    brands,
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
      name.trim(),
      brands,
      description,
    );

    if (!result.ok) {
      //toast.show(result.data, {type: "danger"});
      console.log("danger");
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
    brands,
    description,
  }) => {
    //const brandsArray = brands.split(",").map((item) => item.trim()).filter((item) => item !== "");

    setScanned(false); // Reset the scanned state
    
    addScannedProduct({
        barcode: barcode,
        userId: userId,
        name: name,
        brands: brands, // Use the arrays instead of strings
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
  
  useEffect(() => {
    // Your function to run when the component is mounted
    getAllBrands();
  }, []); // The empty array [] means this effect will only run once, equivalent to componentDidMount in class components

  
  return (
    <Page>
        <View style={{ marginVertical: 5, backgroundColor: "blue", width: 100, height: 100, borderRadius: 10, backgroundColor: "gray", justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
          <Icon
          name="image-outline"
          width={24} // Set the width of the icon
          height={24} // Set the height of the icon
          fill={theme["color-basic-600"]} // Set the color of the icon
          />
        </View>
        <Formik
            initialValues={{
                barcode: barcode,
                userId: user ? user._id : "",
                //images: [],
                name: "",
                brands: selected,
                description: "",
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
{/* 
                <MultipleSelectList
                  defaultOption={{ key:'1', value:'Jammu & Kashmir' }}
                  placeholder="Brands"
                  setSelected={(val) => setSelectedBrandsIds(val)} 
                  data={brandsNames} 
                  save="key"
                  label="Brands"
                  boxStyles={{ backgroundColor: "#F7F9FC", borderColor: "#E4E9F2", borderRadius: 4}}
                  fontFamily='Jost-Regular'
                  inputStyles={{ color: "#8F9BB3", fontSize: 17}}
                  dropdownTextStyles={{color: "#222B45"}}
                  dropdownStyles={{marginBottom: 10, backgroundColor: "#F7F9FC", borderColor: "#E4E9F2", borderRadius: 4}}
                  checkBoxStyles={{borderColor: '#8F9BB3'}}
                  badgeStyles={{backgroundColor: "#8F9BB3", borderRadius: 4}}
                  onChangeText={handleChange("brands")}
                  errorMessage={errors.brands}
                  onBlur={() => setFieldTouched("brands")}
                  errorVisible={touched.brands}
                />
 */}
                <MultiSelect
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={brandsNames}
                  labelField="label"
                  valueField="value"
                  placeholder="Select item"
                  value={values.brands}
                  search
                  searchPlaceholder="Search..."
                  onChange={item => {
                    setSelected(item);
                    setFieldValue("brands", item);
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
                <Button onPress={() => console.log(values.brands)} style={{flex: 1, margin: 20}}>test</Button>
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
    backgroundColor: 'white',
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

    elevation: 2,
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
