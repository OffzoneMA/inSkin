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
  Text
} from "react-native";
import CustomButton from "../../components/Button";
import HomeHeader from "../../components/HomeHeader";
import Page from "../../components/Page";
import Heading from "../../components/Heading";
import Label from "../../components/Label";
import SubHeading from "../../components/SubHeading";
import Paragraph from "../../components/Paragraph";


import productActionsApi from "../../api/product_actions";

//import { useToast } from "react-native-toast-notifications";

import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation

import { useTheme, Icon } from "@ui-kitten/components";

// API
import authApi from "../../api/auth";


function DiscoverHome1({ navigation }) {

  // const toast = useToast();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const theme = useTheme();
  const [randomUsers, setRandomUser] = useState([]);


  const getRandomUsers = async (setRandomUsers, setIsRefreshing) => {

    try {
      const result = await authApi.getRandomUsers();
  
      // Ajoutez des logs pour inspecter le résultat
      //console.log("Résultat brut de l'API:", result);
  
      // Vérifiez si result est un tableau
      if (Array.isArray(result)) {
        // Filtrer les données pour conserver uniquement les propriétés nécessaires
        const filteredUsers = result.map(user => ({
          firstName: user.firstName,
          lastName: user.lastName,
          profileImage: user.profileImage,
        }));
  
        setRandomUser(filteredUsers);
      } else {
        console.error("Les données de l'API ne sont pas sous la forme attendue. Structure actuelle:", JSON.stringify(result));
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
      // getAllComments();
      getRandomUsers();
    }, [])
  );

  const onRefresh = () => {
    setIsRefreshing(true); // Set refreshing state to true when the user pulls down to refresh
    // getAllComments();
    getRandomUsers();
  };

// const handleFollow = async (userId) => {
//   try {
//     // Appeler l'API pour suivre l'utilisateur cible
//     const result = await authApi.followUser(userId);
//     console.log(result);

//     // Gérer la réponse de l'API
//     if (result.success) {
//       // Mettre à jour la liste des followings localement
//       const newFollowings = [...followings, userId];
//       setFollowings(newFollowings);

//       // toast.show("Followed successfully!");
//       console.log("Followed successfully!");
//     } else {
//       console.error("Error following user:", result.message);
//     }
//   } catch (error) {
//     console.error("Error following user:", error);
//     // toast.show("Error following user.");
//   }
// };
const handleFollow = async (userId) => {
  try {
    // Appeler l'API pour suivre l'utilisateur cible
    const result = await authApi.followUser(userId);
    console.log(result);

    // Gérer la réponse de l'API
    if (result.success) {
      // Mettre à jour la liste des followings localement
      const newFollowings = [...followings, userId];
      setFollowings(newFollowings);

      // toast.show("Followed successfully!");
      console.log("Followed successfully!");
    } else {
      console.error("Error following user:", result.message);
    }
  } catch (error) {
    console.error("Error following user:", error);
    // toast.show("Error following user.");
  }
};
////////////////////////////////////////////////////////////////////////
const UserItem = ({ user}) => (

  <TouchableOpacity 
    activeOpacity={0.7} 
    style={[styles.item, { backgroundColor: '#FFFFFF' }] } 
    onPress={() => {  console.log("Navigating to user's profile");/* Naviguer vers la page de profil de l'utilisateur */ }}
  >
    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <MaterialIcons style={{ marginLeft: 200 }} name="close" size={24} color="black" onPress={() => handleFollow(user.userId)} />
      
      <View style={[styles.profileIconWrapper, { width: 103, height:103, borderRadius: 50, backgroundColor: theme['color-primary-disabled-border'], justifyContent: "center", alignItems: "center", aspectRatio: 1, overflow: 'hidden' }]}>
        {user.profileImage ? 
(
          <Image 
            source={{ uri: `data:${user.profileImage.contentType};base64,${user.profileImage.data}`}}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        ) : (
          <Icon
            name="image-outline"
            width={96}
            height={96}
            fill={theme["background-basic-color-1"]}
            style={{ alignSelf: "center", borderTopWidth: 2, borderColor: '#0098AD', backgroundColor: '#D9D9D9' }}
          />
        )}
      </View>
      
      <View style={{ flex: 1, flexDirection: "row" }}>
        <SubHeading style={{ width: 91, height: 28, marginLeft: 4, color: 'black', alignItems:'center', lineHeight:27.54, fontSize:13, fontWeight: 400 }}>{user.firstName} {user.lastName}</SubHeading>
      </View>
      
      {/* Ajoutez ici la liste des produits de l'utilisateur */}
      {/* Utilisez les informations de l'image pour afficher les produits de manière similaire */}
    
  
      
      <TouchableOpacity
        onPress={() => handleFollow(user.userId)}
        style={{
          backgroundColor: '#EA6479',
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 8,
          gap: 12,
          width: 124,
          height: 36,
          justifyContent: 'center', 
          alignItems: 'center', 
        }}
      >
          <Text style={{
          width: 38,
          height: 24,
          fontSize: 12,
          fontWeight: 600,
          lineHeight: 24,
          color: '#FFFFFF',
        }}>Follow</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);


return (
  <Page >
     <HomeHeader/>
    {/* <Heading>Browse</Heading> */}
    <View style={{ alignItems: 'center', width:'262px', height:'76px', marginTop:'161px', marginLeft:'84px', marginRight:'84px',marginBottom: "695px", gap:10 }}>
        <Text style={{ color: '#333333', fontWeight: 500, textAlign: 'center' ,fontSize: 20 ,lineHeight: 24.2}}>Welcome to INSKINE</Text>
        {/* fontFamily: 'Inter' */}
        <View style={{ alignItems: 'center' }}>
           <Text style={{ textAlign: 'center',fontSize: 15, width: '262px', height: '40px',color: '#9C9C9E'}}><Text style={{ textAlign: 'center' }}>
                    Follow people to start seeing the {'\n'}
                    products and posts they share. </Text>
           </Text>
      </View>
    </View>
    <SafeAreaView >
        <FlatList
            horizontal
            data={randomUsers}
            renderItem={({ item }) => <UserItem user={item} />}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={[theme['color-primary-default']]} // Array of colors
                progressBackgroundColor={theme["background-basic-color-2"]} // Background color of the indicator
              />
            }
            style={{
              marginTop:48,
              width: 400,
              borderRadius: 20,
              padding: 24,
              margin: 16,
              gap: 14,
              backgroundColor: '#E0E0E0', 
              shadowOffset: {
                width: 0,
                height: 14,
              },
          
            }}
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
  button: {
    backgroundColor: '#EA6479',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: 124,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 24,
    color: '#FFFFFF',
  },

});


export default DiscoverHome1; 

