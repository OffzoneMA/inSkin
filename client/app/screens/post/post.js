import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useTheme, Text, Icon } from "@ui-kitten/components";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Page from "../../components/Page";
import Paragraph from "../../components/Paragraph";
import productActionsApi from "../../api/product_actions";
import { useFocusEffect } from "@react-navigation/native";
import StarRating from 'react-native-star-rating-widget';
import Button from "../../components/Button";
function PosteHome({ route,navigation }) {
  const [products, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(true);

  const getMyProducts = async () => {
    try {
      const response = await productActionsApi.getmyproduct(); // Assuming this is the API call
      if (!response.ok) {
        // Handle error
      } else {
        setProducts(response.data.products); // Assuming response.data.products contains the products
      }
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  // Fetch products when the component mounts
  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Set loading state to true
      getMyProducts();
    }, [])
  );

  const handleAddPublication = async () => {
    navigation.navigate("AddPublicationScreen");
    console.log("result.uri");
  };
  return (
    <Page>
      <View style={styles.container}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : products.length === 0 ? (
          <View style={styles.centeredContent}>
            <Text style={styles.emoji}>😔</Text>
            <Text style={styles.message}>Oops, vous n'avez pas encore publié de publication.</Text>
            <Button
       
        title="Sign up"
        onPress={handleAddPublication}
        style={{
          marginTop: 20,
          
          backgroundColor: '#EA6479', // couleur de fond du bouton
          color: 'white', // couleur du texte du bouton
          borderColor: '#EA6479', // couleur de la bordure du bouton
          borderWidth: 1, // épaisseur de la bordure
          borderRadius: 5, // bordure arrondie
        }}
        textStyle={styles.buttonText}
       
      >
        Ajouter une publication
      </Button>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={({ item }) => <ProductItem item={item} />}
            keyExtractor={(item) => item._id}
          />
        )}
      </View>
    </Page>
  );
}

const ProductItem = ({ item }) => {
  const theme = useTheme();
  return (
    <View style={{ marginVertical: 5, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <Text>{item.productDetails.name}</Text>
        <StarRating
          rating={item.review}
          onChange={() => {}}
          animationConfig={{ scale: 1 }}
          starSize={18}
          starStyle={{ marginHorizontal: 0 }}
        />
        {item.text !== "" ? <Paragraph style={{ marginLeft: 4 }}>{item.text}</Paragraph> : null}
      </View>
      <View style={{ padding: 5 }}>
        <TouchableOpacity style={{ borderRadius: 5 }} activeOpacity={0.5}>
          <MaterialCommunityIcons name={"heart-outline"} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: 'black',
  },
  centeredContent: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  emoji: {
    fontSize: 50,
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: 'black',
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PosteHome;
