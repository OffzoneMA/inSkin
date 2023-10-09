import React, { useState, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Pressable,
} from "react-native";

import Page from "../../components/Page";
import Heading from "../../components/Heading";

import { useTheme, Icon } from "@ui-kitten/components";

import { MultipleSelectList } from 'react-native-dropdown-select-list'

import TextInput from "../../components/TextInput";
import Button from "../../components/Button";

import brandActionsApi from "../../api/brand_actions";

function AddProduct({ navigation, route }) {

  const theme = useTheme();

  const { barcode } = route.params;

  const [selected, setSelected] = useState("");
  
  const data = [
    {key:'1', value:'Mobiles', disabled:true},
    {key:'2', value:'Appliances'},
    {key:'3', value:'Cameras'},
    {key:'4', value:'Computers', disabled:true},
    {key:'5', value:'Vegetables'},
    {key:'6', value:'Diary Products'},
    {key:'7', value:'Drinks'},
  ]

  const [brandsNames, setBrandsNames] = useState([]);

  const getAllBrands = async () => {
    try {
      const result = await brandActionsApi.getAllBrands();
      if (!result.ok) {
        //toast.show(result.data, { type: "danger" });
      } else {
        //toast.show(result.data.message, { type: "success" });
        const brandsNames = result.data.brands.map(brand => ({
          key: brand._id, // Use _id as the key
          value: brand.name // Use name as the value
        }));
        setBrandsNames(brandsNames);
        console.log(brandsNames)
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const onCancelClick = () => {
    navigation.goBack();
  }
  
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
          <TextInput>{barcode}</TextInput>
          <TextInput>{"product.productDetails.name"}</TextInput>
          <View>
            <MultipleSelectList 
              setSelected={(val) => setSelected(val)} 
              data={data} 
              save="value"
              onSelect={() => alert(selected)} 
              label="Categories"
            />
          </View>
          <TextInput>{"product.productDetails.description"}</TextInput>
          <View style={{flexDirection: "row", justifyContent: "space-between"}}>
            <Button style={{flex: 2, marginRight: 2}}>Add Product</Button>
            <Button onPress={onCancelClick} style={{flex: 1, marginLeft: 2, backgroundColor: "gray", borderColor: "gray"}}>Cancel</Button>
          </View>
          <Button onPress={alert(brandsNames)}
            style={{flex: 1, margin: 20}}
          >test</Button>
    </Page>
  );
}

const styles = StyleSheet.create({
});

export default AddProduct;
