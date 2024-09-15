import React, { useContext, useLayoutEffect } from "react";
import { StyleSheet, View, Image, ScrollView, SafeAreaView,FlatList, TouchableOpacity } from "react-native";
import { useTheme, Text, Icon } from "@ui-kitten/components";
import { LocalesMessages } from '../../constants/locales';
import Page from "../../components/Page";
import AuthContext from "../../contexts/auth";
import authStorage from "../../utilities/authStorage";
import Button from "../../components/Button";
import { useState } from "react";
import authApi from "../../api/auth";
import productActionsApi from "../../api/product_actions";
import useApi from "../../hooks/useApi";
import { encode } from 'base-64';
import ProductItemView from '../../components/ProductItemView'
import ProductListEmptyView from '../../components/ProductListEmptyView'
import ProfileFollowerView from './ProfileFollowerView';
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect from React Navigation
import CustomHeaderView from '../../components/CustomHeaderView';
import { images } from '../../constants';
import { selectProductDetailData } from '../../redux/selector/appSelectors'
import { colors } from '../../constants'
import { useSelector } from 'react-redux'
function ProfileHome({ navigation }) {
  const authContext = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const productData = useSelector(selectProductDetailData)
  const [productList, setProductList] = useState([])
  const getProfileImageApi = useApi(authApi.getProfileImage);

  const getProfileImage = async () => {
    try {
      const profileImage = await getProfileImageApi.request(user._id);
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
  const getmycommentedproducts = async () => {
    try {
      const result = await productActionsApi.getmycommentedproducts();
      setProductList(result.data)
      console.log("getmycommentedproducts" ,result)
      if (!result.ok) {
      
      } else {
       
        
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

  useFocusEffect(
    React.useCallback(() => {
      if (user && user._id) {
        getProfileImage();
      }
      getmycommentedproducts();
    }, [])
  );

  

  const userProfile = {
    profilePicture: "person",
    firstName: user ? user.firstName : null,
    lastName: user ? user.lastName : null,
    userName: user ? user.userName : null,
  };

  const menuItems = [
    {
      id: 1,
      icon: "bookmark-outline",
      text: "Saved",
      iconColor: theme["color-primary-default"],
      onPress: () => navigation.navigate("ProfileSaved"),
    },
    {
      id: 3,
      icon: "info-outline",
      text: "About",
      iconColor: theme["color-primary-default"],
      onPress: () => navigation.navigate("ProfileAbout"),
    },
    {
      id: 4,
      icon: "settings-outline",
      text: "Settings",
      iconColor: theme["color-primary-default"],
      onPress: () => navigation.navigate("ProfileSettings"),
    },
    {
      id: 5,
      icon: "log-out",
      text: "Log Out",
      iconColor: theme["notification-error"],
      onPress: handleLogOut,
    },
  ];


  return (
     <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false} >
        <View style={styles.mainContainer}>
        <CustomHeaderView
            rightButtonImage={images.myProfile}
            rightButtonOnPress={() => {
              navigation.navigate('ProfileEdit1')
            }}
          />
          <ProfileFollowerView
            onPressEditProfile={() => {
              navigation.navigate("ProfileEdit")
            }}
            //navigation.navigate(Route.PersonalDetailScreen)
          />
            
            <FlatList
            data={productList}
            scrollEnabled={false}
            numColumns={2}
            style={styles.flatList}
            contentContainerStyle={styles.flatListContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return <ProductItemView index={index} 
              isFromFavoriteList={false}
              item={item}
              averageRating={item.comment}
              ratingsCount={item.comment}
                />
            }}
            ListEmptyComponent={() => {
              return (
                <ProductListEmptyView
                  emptyMessage={LocalesMessages.youHaveToCommentOrRateProduct}
                  onPressScanProduct={() => {
                    setProductList(productData)
                  }}
                />
              )
            }}
          />
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});

export default ProfileHome;