import React, { useState } from "react";
import { MaterialIcons } from '@expo/vector-icons';
import {
  SafeAreaView,
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  RefreshControl,
  Image,
  TouchableOpacity,
  Button,
  Text
} from "react-native";

import Page from "../../components/Page";
import Heading from "../../components/Heading";
import Label from "../../components/Label";
import SubHeading from "../../components/SubHeading";
import Paragraph from "../../components/Paragraph";

import productActionsApi from "../../api/product_actions";

//import { useToast } from "react-native-toast-notifications";

import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation

import { useTheme, Icon } from "@ui-kitten/components";

import StarRating from 'react-native-star-rating-widget';

import { encode } from 'base-64';

function DiscoverHome({ navigation }) {
  //const toast = useToast();
  const [comments, setComments] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const theme = useTheme();

  const getAllComments = async () => {
    try {
      const result = await productActionsApi.getAllComments();
      
      if (!result.ok) {
        //toast.show(result.data, { type: "danger" });
      } else {
        //toast.show(result.data.message, { type: "success" });
        // Sort the comments array by 'createdAt' property in descending order
        const sortedComments = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setComments(sortedComments);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsRefreshing(false); // Set refreshing state to false after data fetch is completed
    }
  };

  // Fetch products when the component mounts and when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setIsRefreshing(true); // Set refreshing state to true when the screen comes into focus
      getAllComments();
    }, [])
  );

  const onRefresh = () => {
    setIsRefreshing(true); // Set refreshing state to true when the user pulls down to refresh
    getAllComments();
  };

  const getProductById = async (_id) => {
    try {
      const result = await productActionsApi.getProductById(_id);
      
      // Handle the case when result is ok
      navigation.navigate('Product', { productId: result._id });
  
    } catch (error) {
      console.error("Error getting product data: ", error);
    }
  }
  
  const Item = ({ item }) => (
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={[styles.item, {backgroundColor: '#F4F4F4'}]} 
      onPress={() => { getProductById(item.productId); }}
    >
    
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <MaterialIcons style={{marginLeft:200}} name="close" size={24} color="black" onPress={() => handleFollow(item.userId)} />
        <View style={[styles.profileIconWrapper, {width: 100, borderRadius: 50, backgroundColor: theme['color-primary-disabled-border'],justifyContent: "center", alignItems: "center", aspectRatio: 1, overflow: 'hidden'}]}>
          {item.profileImage && item.profileImage.data && item.profileImage.data.data ? (
            <Image 
              source={{ uri: 'data:' + item.profileImage.contentType + ';base64,' + encode(item.profileImage.data.data.map(byte => String.fromCharCode(byte)).join('')) }}
            />
          ) : (
            <Icon
              name="image-outline"
              width={24}
              height={24}
              fill={theme["background-basic-color-1"]}
              style={{alignSelf: "center"}}
            />
          )}
        </View>
        <View style={{ flex: 1, flexDirection:"row"}}>
      <SubHeading style={{ marginLeft: 4, color: 'black'}}>{item.productName}</SubHeading>
      </View>
      <Button onPress={() => handleFollow(item.userId)} title="Suivre" />
      </View>

    </TouchableOpacity>
  );
  
  return (
    <Page style={{color: "red"}}>
      <Heading>Browse</Heading>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' ,fontSize: 25}}>Welcome to INSKINE</Text>
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ textAlign: 'center',fontSize: 18 }}><Text style={{ textAlign: 'center' }}>
    Follow people to {'\n'}
    start seeing the products{'\n'}
     and posts they share.
  </Text></Text>
      </View>
      <SafeAreaView>
        <FlatList
        horizontal
        
          data={comments}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[theme['color-primary-default']]} // Array of colors
              progressBackgroundColor={theme["background-basic-color-2"]} // Background color of the indicator
            />
          }
        />
      </SafeAreaView>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
   
  },
  item: {
    flexDirection: "row",
    padding: 8,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 300,
    width:250,
    margin: 5,
  },
  title: {
    fontSize: 32,
  },
  profileIconWrapper: {
    borderRadius: 98,
  },
});

export default DiscoverHome;
