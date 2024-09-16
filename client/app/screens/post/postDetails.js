import React, { useContext, useEffect, useState } from 'react'
import { Alert, FlatList, SafeAreaView, View } from 'react-native'
import FavoriteHeaderView from '../FavoriteScreen/FavoriteHeaderView'
import ProductItemView from '../../components/ProductItemView'
import FavoriteListData from '../../../data/favoriteData.json'
import FavoriteFilterData from '../../../data/favoriteFilterData.json'
import { styles } from '../FavoriteScreen/styles'
import ProductListEmptyView from '../../components/ProductListEmptyView'
import { LocalesMessages } from '../../constants/locales'
import AddCategoryPopup1 from '../../components/Popups/AddCategoryPopup'
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
function PostDetails () {
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
 

  useFocusEffect(
    React.useCallback(() => {
      
    }, [])
  );


  useFocusEffect(
    React.useCallback(() => {
     
      
    }, [])
  );
  const rightButtonImage = selectedImageUri ? selectedImageUri : images.userAvatar;
  return (
    <SafeAreaView style={styles.safeArea}>
       
      
      
          <ProductListEmptyView
            fromAjoutProduit={true}
            
            mainContainerStyle={styles.emptyViewMainContainer}
            messageempty="Merciiiiiiii"
            onPressScanProduct={() => {
              setShowActionModal(true)
            }}
          />
        
      
        <AddCategoryPopup1
        
        isVisible={showActionModal}
        isFromFavorite={true}
        onPressClose={() => {
          
          setShowActionModal(false)
        }}
        onPressAdd1={() => {
          handleAddFavorite(productId, selectedCategory);
        }}
        onPressAdd={(selectedCategory) => {
          console.log("principale selectedCategory",selectedCategory)
          handleAddFavorite(productId, selectedCategory);
        }}
        onChangeText={(text) => setSelectedCategory(text)}
       
      />
      
    </SafeAreaView>
  )
}

export default PostDetails;


