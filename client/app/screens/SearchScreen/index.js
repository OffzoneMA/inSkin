import React, { useContext, useLayoutEffect,useEffect } from "react";
import { StyleSheet, View, Image, ScrollView, SafeAreaView,FlatList, TouchableOpacity } from "react-native";
import { useTheme, Text, Icon } from "@ui-kitten/components";
import { LocalesMessages } from '../../constants/locales';
//import Icon from 'react-native-vector-icons/Ionicons';
import Page from "../../components/Page";
import AuthContext from "../../contexts/auth";
import authStorage from "../../utilities/authStorage";
import Button from "../../components/Button";
import { useState } from "react";
import authApi from "../../api/auth";
import useApi from "../../hooks/useApi";
import { encode } from 'base-64';
import ProductItemView from '../../components/ProductItemView'
import TopIcons from "../../components/TopIcons";
import ProductListEmptyView from '../../components/ProductListEmptyView'
import SearchFollowerView from './SearrchProfile';
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation
import CustomHeaderView from '../../components/CustomHeaderView';
import { images } from '../../constants';
import { selectProductDetailData } from '../../redux/selector/appSelectors'
import { colors } from '../../constants'
import { useSelector } from 'react-redux'
import { useNavigation } from "@react-navigation/native";

function SearchScreen({route}) {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const productData = useSelector(selectProductDetailData)
  const [productList, setProductList] = useState([])
  const getProfileImageApi = useApi(authApi.getProfileImage);
  const [favoriteList, setFavoriteList1] = useState([]);
  const [FavoriteList2, setFavoriteList2] = useState([]);
  const { userId } = route.params;
  const [isFollower, setIsFollower] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('grid'); // Par défaut sur 'grid'
  const currentUserId=user._id;
  console.log("j arrive ici", userId);
  const getProfileImage = async () => {
    try {
      const profileImage = await getProfileImageApi.request(userId._id);
      if (profileImage && profileImage.data && profileImage.data.data && profileImage.data.data.data) {
        const imageData = profileImage.data.data.data;
        const base64ImageData = imageData.map(byte => String.fromCharCode(byte)).join('');
        const imageUrl = 'data:' + profileImage.data.contentType + ';base64,' + encode(base64ImageData);
        setSelectedImageUri(imageUrl);
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };
  const getfavoriteproducts = async () => {
    try {
      console.log("i m here")
      const result = await authApi.getfavori(userId._id);
      console.log("resulte", result);
      if (!result) {
      
      } else {

        setFavoriteList1(result); 
        console.log("FavoriteList1",favoriteList.length)
        
        
      }
    } catch (error) {
      console.error("Error getting product data: ", error);
    }
  };
  const handleLogOut = () => {
    setTimeout(() => {
      authContext.setUser(null);
      authStorage.removeToken();
    }, 300);
  };
  console.log("j arrive ici 1");
  useFocusEffect(
    React.useCallback(() => {
      if (user && user._id) {
        getProfileImage();
      }
      getfavoriteproducts();
      if (userId.followers.includes(currentUserId)) {
        console.log("il existe ici ");
        setIsFollower(true);
      } else {
        console.log("n'existe  pas ici ici ");
        setIsFollower(false);
      }
    }, [])
  );

  useEffect(() => {
    // Vérification si l'utilisateur actuel est dans la liste des followers
    console.log("currentUserId", user._id);
    console.log("userId.posts.length",userId.posts.length)
    if (userId.followers.includes(user._id)) {
      console.log("il existe ici ");
      setIsFollower(true);
    } else {
      console.log("n'existe  pas ici ici ");
      setIsFollower(false);
    }
  }, [userId, currentUserId]);
console.log("isFollower",isFollower);
  const userProfile = {
    profilePicture: "person",
    firstName: user ? user.firstName : null,
    lastName: user ? user.lastName : null,
    userName: user ? user.userName : null,
  };
  const handleFollow1 = async (email) => {
    try {
      console.log(email)
      const response = await authApi.followUser(email); 
      console.log("User followed successfully:", response);
      setIsFollower(true);
    } catch (error) {
      console.error("Error following user:", error);
      
    }
  };
  return (
     <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false} >
        <View style={styles.mainContainer}>
        <CustomHeaderView
           title={userId.userName}
           leftButtonImage={images.backButton}
           leftButtonOnPress={() => {
             navigation.goBack()
           }}
           rightButtonImage={images.share1}
            rightButtonOnPress={() => {
              navigation.navigate('ProfileEdit1')
            }}
            isFromProfileMenu={false}
          />
          <SearchFollowerView
            onPressFollowProfile={() => {
              handleFollow1(userId.email)
            }}
            firstName={userId.firstName}
            lastName={userId.lastName}
            isFollower={isFollower}
            followers={userId.followers.length}
            posts={userId.posts.length}
            userId={userId._id}

            //navigation.navigate(Route.PersonalDetailScreen)
          />
          <View>
          <TopIcons selectedIcon={selectedIcon} onIconSelect={setSelectedIcon} />
      {/* Autres éléments ici */}
       </View>
          </View>
          {selectedIcon === 'grid' ? (
        <>
          {/* Si la liste est vide, afficher la vue vide */}
          {favoriteList.length === 0 && (
            <ProductListEmptyView
            fromrecherche={true}
              emptyMessage={"Ce client n'a aucun produit favori."} // Message à afficher
              mainContainerStyle={styles.emptyViewMainContainer}
              onPressScanProduct={() => {
                // Ajoute des produits fictifs pour simuler une liste remplie
                setFavoriteList(FavoriteListData.favoriteList);
              }}
            />
          )}

          {/* Affichage des produits favoris en grille si la liste n'est pas vide */}
          <FlatList
            data={favoriteList}
            numColumns={2} // Grille avec 2 colonnes
            horizontal={false}
            style={styles.body}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <ProductItemView
                  key={index}
                  isFromFavoriteList={true}
                  item={item}
                  onPressItem={() => {
                    navigation.navigate('FavoriteDetailScreen', {
                      listName: item.category,
                    });
                  }}
                />
              );
            }}
          />
        </>
      ) : (
        // Affichage alternatif si l'icône "nature" est sélectionnée
        <Text style={styles.text}>Affichage en nature (arbre) sélectionné</Text>
      )}
         
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
    color: "black"
  },
  profileContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  mainContainer: {
    paddingHorizontal: 20,
  },
  profilePictureContainer: {
    borderRadius: 100,
    marginBottom: 10,
    borderWidth: 2,
    padding: 2,
    width: 80,
    height: 80,
    marginRight: 15,
  },
  profileIconWrapper: {
    borderRadius: 98,
    flex: 1,
  },
  profilePicture: {},
  profileName: {
    fontSize: 16,
    color: 'black',
  },
  infoContainer: {
    flexDirection: 'column',
  },
  profileUserName: {
    fontSize: 18,
    color: 'black',
  },
  followersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    color: 'black',
  },
  followersContainerButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  followersNumber: {
    fontSize: 17,
    fontWeight: "bold",
    justifyContent: "center",
    color: 'black',
  },
  followersText: {
    fontSize: 15,
    fontWeight: "bold",
    justifyContent: "center",
    color: 'black',
  },
  editProfileButton: {
    marginTop: 25,
    borderRadius: 20,
    paddingVertical: 12,
    color: 'black',
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  logoutText: {
    fontSize: 18,
    color: 'black',
    fontWeight: "bold",
  },
  primaryIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  secondaryIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 200,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  logoutIcon: {
    width: 18,
    height: 20,
  },
  separator: {
    height: 1,
    width: "100%",
    alignSelf: "center",
    marginVertical: 10,
  },
  headerRightButton: {
    marginRight: 20,
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)', // Add a background color to make the circle visible
  },
  scrollView: {
    flexGrow: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconText: {
    color: 'gray',
    fontSize: 12,
  },
  iconTextActive: {
    color: '#ff5a5a',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default SearchScreen;