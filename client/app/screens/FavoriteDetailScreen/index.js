import React, { useContext, useState } from 'react'
import { Alert, FlatList, SafeAreaView, Share, View } from 'react-native'
import styles from './styles'
import CustomHeaderView from '../../components/CustomHeaderView'
import { colors, images } from '../../constants'
import { LocalesMessages } from '../../constants/locales'
import { useNavigation, useRoute } from '@react-navigation/native'
import AppText from '../../components/AppText'
import { useSelector } from 'react-redux'
import { selectProductDetailData } from '../../redux/selector/appSelectors'
import ProductItemView from '../../components/ProductItemView'
import ProductListEmptyView from '../../components/ProductListEmptyView'
import AddCategoryPopup from '../../components/Popups/AddCategoryPopup'
import ActionModal from '../FavoriteScreen/ActionModal'
import { LocalizationContext } from '../../contexts/LocalizationContext'
import authApi from "../../api/auth";
import { useFocusEffect } from "@react-navigation/native";
const FavoriteDetailScreen = () => {
  const navigation = useNavigation()
  const { translate } = useContext(LocalizationContext)
  const route = useRoute()
  const listName = route.params.listName ?? ''
  const [productList, setProductList] = useState([])
  const [averageRating,setAverageRating]=useState(0)
  const [showAddEditCategoryModal, setShowAddEditCategoryModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const productData = useSelector(selectProductDetailData)
  const [productRating, setProductRating] = useState(0);
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
  const onShareProduct = async () => {
    try {
      const result = await Share.share({
        message:
          'Contra Mix',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const favoriteproductsbycategory = async (listName1) => {
    try {
      
      const result = await authApi.favoriteproductsbycategory(listName1);
      const sortedProducts = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProductList(sortedProducts);
    } catch (error) {
      console.error("Error getting product data: ", error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      favoriteproductsbycategory(listName);
      // getCategories();
      // getFavorite(user._id)
      
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.mainContainer]}>
        <CustomHeaderView
          title={LocalesMessages.favorites}
          leftButtonImage={images.backButton}
          leftButtonOnPress={() => {
            navigation.goBack()
          }}
          rightButtonImage={images.plusIcon}
          rightImageStyle={{
            width: 26,
            height: 26,
          }}
          rightButtonOnPress={() => {}}
        />
        <View
          style={{
            marginVertical: 14,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderColor: colors.dividerGray,
          }}>
          <AppText
            text={listName}
            numberOfLines={2}
            color={colors.lightBlack}
            size='font16px'
            fontFamily='medium'
          />
        </View>
        {productList.length === 0 && (
          
          <ProductListEmptyView
          emptyMessage={LocalesMessages.youDontHaveAnyFavorites}
          mainContainerStyle={styles.emptyViewMainContainer}
          buttonTitle={LocalesMessages.scanAddProduct}
          buttonStyle={{ width: 200 }}
          onPressScanProduct={() => {
           
          }}
        />
        
      )}
        <FlatList
          data={productList}
          numColumns={2}
          horizontal={false}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <ProductItemView
                key={index}
                item={item}
                onPressOption={() => setShowActionModal(true)}
                averageRating={calculateProductRating(item.comment)}
              />
            )
          }}
         
        />
      </View>
      <AddCategoryPopup
        isVisible={showAddEditCategoryModal}
        isFromFavorite={true}
        onPressClose={() => {
          setShowAddEditCategoryModal(false)
        }}
        onPressAdd={() => {
          setShowAddEditCategoryModal(false)
        }}
      />
      <ActionModal
        isVisible={showActionModal}
        isFromFavoriteProduct={true}
        onPressClose={() => setShowActionModal(false)}
        onPressEditCategory={() => {
          setShowActionModal(false)
          setTimeout(() => {
            onShareProduct()
          }, 800)
        }}
        onPressDeleteCategory={() => {
          setShowActionModal(false)
          const options = [
            { text: LocalesMessages.cancel },
            {
              text: LocalesMessages.confirm,
              style: 'destructive',
              onPress: () => {},
            },
          ]
          Alert.alert('', LocalesMessages.areYouSureDeleteProduct, options)
        }}
      />
    </SafeAreaView>
  )
}

export default FavoriteDetailScreen;
