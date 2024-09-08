import React, { useContext, useEffect, useState } from 'react'
import { Alert, FlatList, SafeAreaView, View } from 'react-native'
import FavoriteHeaderView from '../FavoriteScreen/FavoriteHeaderView'
import ProductItemView from '../../components/ProductItemView'
import FavoriteListData from '../../../data/favoriteData.json'
import FavoriteFilterData from '../../../data/favoriteFilterData.json'
import { styles } from '../FavoriteScreen/styles'
import ProductListEmptyView from '../../components/ProductListEmptyView'
import { LocalesMessages } from '../../constants/locales'
import AddCategoryPopup from '../../components/Popups/AddCategoryPopup'
import ActionModal from '../FavoriteScreen/ActionModal'
import { LocalizationContext } from '../../contexts/LocalizationContext'
import { useNavigation } from '@react-navigation/native'
import { Route } from '../../constants/constants'
import FilterModal from '../FavoriteScreen/FilterModal'
import AppText from '../../components/AppText'
import { colors } from '../../constants'
import authApi from "../../api/auth";
import { images } from '../../constants'
import productActionsApi from "../../api/product_actions";
import AuthContext from "../../contexts/auth";
import { useFocusEffect } from "@react-navigation/native";
import CustomHeaderView from '../../components/CustomHeaderView';
import { encode } from 'base-64';
const MyPostScreen = () => {
  const navigation = useNavigation()
  const { translate } = useContext(LocalizationContext)
  const [favoriteList, setFavoriteList] = useState([])
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showAddEditCategoryModal, setShowAddEditCategoryModal] = useState(false)
  const [selectedCategoryTitleForEdit, setSelectedCategoryTitleForEdit] = useState('')
  const [showActionModal, setShowActionModal] = useState(false)
  const [isSearchFilterApplied, setIsSearchFilterApplied] = useState(false)
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const getProfileImageApi = useApi(authApi.getProfileImage);
  const authContext = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
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
  function calculateProductRating(array) {
    if (!Array.isArray(array) || array.length === 0) {
      return 0; // Retourne 0 si le tableau est vide ou non valide
  }
  const sum = array.reduce((accumulator, value) => {
    return accumulator + value;
}, 0);

  console.log("sum",sum);
  const average = sum / array.length; 
  return average;
}
function calculateratingsCount(array) {
  if (!Array.isArray(array) || array.length === 0) {
    return 0; // Retourne 0 si le tableau est vide ou non valide
}
const sum = array.reduce((accumulator, value) => {
  return accumulator + value;
}, 0);
console.log("sum",sum);

return sum;
}

  useFocusEffect(
    React.useCallback(() => {
      if (user && user._id) {
        getProfileImage();
      }
    }, [])
  );

  const getmyproduct = async () => {
    try {
      const result = await productActionsApi.getmyproduct();
      product=result.data;
      setFavoriteList(product);
      console.log("pdhdhdh",product)
      console.log("liste de produit de userjsjjssjjsjsj", result);
      
      if (!result.ok) {
        console.error("Erreur lors de la récupération des favoris");
        return;
      } else{
        product=result.data;
        console.log("avant le set",product);
       
        setFavoriteList(product);
        console.log("publuier post",favoriteList);
      }
    } catch (error) {
      console.error("Error getting product data: ", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getmyproduct();
      
    }, [])
  );
  const rightButtonImage = selectedImageUri ? selectedImageUri : images.userAvatar;
  return (
    <SafeAreaView style={styles.safeArea}>
       <CustomHeaderView
          title="Mes publications"
          isFromNotificationHeader={false}
          rightButtonImage={selectedImageUri ?{ uri: selectedImageUri }:images.userAvatar} 
          rightImageStyle={{
            height: 50,
            width: 50,
            borderRadius: 25,
            marginRight: 10,
            resizeMode: 'contain',
          }}
          rightButtonOnPress={() => {}}
        />
      
      {favoriteList.length === 0 && (
          <ProductListEmptyView
            emptyMessage="vous n'avez aucune publication"
            mainContainerStyle={styles.emptyViewMainContainer}
            onPressScanProduct={() => {
              setFavoriteList(FavoriteListData.favoriteList)
            }}
          />
        
      )}
      <FlatList
        data={favoriteList}
        numColumns={2}
        horizontal={false}
        style={styles.body}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <ProductItemView
              key={index}
              isFromFavoriteList={false}
              item={item}
              onPressOption={() => setShowActionModal(true)}
              averageRating={calculateProductRating(item.comment)}
              ratingsCount={calculateratingsCount(item.comment)}
              onPressItem={() => {
                navigation.navigate(Route.FavoriteDetailScreen, {
                  listName: item.favoriteListName,
                })
              }}
            />
          )
        }}
        
      />
      <AddCategoryPopup
        isVisible={showAddEditCategoryModal}
        editTitle={selectedCategoryTitleForEdit}
        isFromFavorite={true}
        onPressClose={() => {
          setShowAddEditCategoryModal(false)
        }}
        onPressAdd={() => {
          setShowAddEditCategoryModal(false)
        }}
      />
      <FilterModal
        isVisible={showFilterModal}
        onPressClose={() => {
          setShowFilterModal(false)
        }}
        onApplyPress={() => {
          setIsSearchFilterApplied(true)
        }}
      />
      <ActionModal
        isVisible={showActionModal}
        onPressClose={() => setShowActionModal(false)}
        onPressEditCategory={() => {
          setShowActionModal(false)
          setSelectedCategoryTitleForEdit(FavoriteFilterData.favoriteList[0].favoriteListName)
          setTimeout(() => {
            setShowAddEditCategoryModal(true)
          }, 800)
        }}
        onPressDeleteCategory={() => {
          setShowActionModal(false)
          const options = [
            { text: translate(LocalesMessages.cancel) },
            {
              text: translate(LocalesMessages.confirm),
              style: 'destructive',
              onPress: () => {},
            },
          ]
          Alert.alert('', translate(LocalesMessages.areYouSureDeleteCategory), options)
        }}
      />
    </SafeAreaView>
  )
}

export default MyPostScreen;


