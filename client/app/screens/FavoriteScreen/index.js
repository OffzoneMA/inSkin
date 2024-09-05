import React, { useContext, useEffect, useState } from 'react'
import { Alert, FlatList, SafeAreaView, View } from 'react-native'
import FavoriteHeaderView from './FavoriteHeaderView'
import ProductItemView from '../../components/ProductItemView'
import FavoriteListData from '../../../data/favoriteData.json'
import FavoriteFilterData from '../../../data/favoriteFilterData.json'
import { styles } from './styles'
import ProductListEmptyView from '../../components/ProductListEmptyView'
import { LocalesMessages } from '../../constants/locales'
import AddCategoryPopup from '../../components/Popups/AddCategoryPopup'
import ActionModal from './ActionModal'
import { LocalizationContext } from '../../contexts/LocalizationContext'
import { useNavigation } from '@react-navigation/native'
import { Route } from '../../constants/constants'
import FilterModal from './FilterModal'
import AppText from '../../components/AppText'
import { colors } from '../../constants'
import authApi from "../../api/auth";
import productActionsApi from "../../api/product_actions";
import AuthContext from "../../contexts/auth";
import { useFocusEffect } from "@react-navigation/native";
const FavoriteScreen = () => {
  const navigation = useNavigation()
  const { translate } = useContext(LocalizationContext)
  const [favoriteList2, setFavoriteList2] = useState([]);
  const [productId, setProductId] = useState([]);
  const [categorie, setCategorie] = useState([]);
  const [favoriteList1, setFavoriteList1] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showAddEditCategoryModal, setShowAddEditCategoryModal] = useState(false)
  const [selectedCategoryTitleForEdit, setSelectedCategoryTitleForEdit] = useState('')
  const [showActionModal, setShowActionModal] = useState(false)
  const [isSearchFilterApplied, setIsSearchFilterApplied] = useState(false)
  const { user } = useContext(AuthContext);
  const [selectedCategories, setSelectedCategories] = useState([]); // Pour stocker les catégories sélectionnées
  const [filteredProducts, setFilteredProducts] = useState([]); // Produits filtrés à afficher
  // const getFavorite = async (_id) => {
  //   console.log("idhola",_id);
  //   try {
      
  //     const result = await authApi.getFavorites(_id);
  //     console.log("listes des favoris ",result);
     
  //   } catch (error) {
  //     console.error("Error getting product data: ", error);
  //   }
  // };
  
  const getfavoriteproducts = async () => {
    try {
      const result = await authApi.getfavoriteproducts();
      if (!result.ok) {
      
      } else {
        const sortedProducts = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFavoriteList1(sortedProducts); 
        console.log("FavoriteList1",favoriteList1.length)
        const mainCategoryList =result.data.map(value => {
          return {
            ...value,
            isSelected: false,
          };
        });
        
        setFavoriteList2(mainCategoryList)
        
      }
    } catch (error) {
      console.error("Error getting product data: ", error);
    }
  };
  // const getfavoriteproducts = async () => {
  //   try {
  //     const result = await authApi.getFavorites(user._id);
  //     const formattedData = Object.keys(result).map(category => ({
  //       category,
  //       data: result[category],
  //     }));
  //     setFavoriteList1(result);
  //     setFavoriteList2(sortedProducts);
  //     console.log("Liste des favoris", result);
  
  //     if (!result.ok) {
  //       // Gérer les erreurs ici
  //       console.error("Erreur lors de la récupération des favoris");
  //       return;
  //     }
  
  //     // Trier les produits par date de création
  //     const sortedProducts = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  //     // Regrouper les produits par catégorie
  //     const groupedByCategory = sortedProducts.reduce((acc, product) => {
  //       const { category , images } = product;
  
  //       if (!acc[category]) {
  //         acc[category] = [];
  //       }
  
  //       acc[category].push({
  //         ...product,
  //         images: images.length > 0 ? images : [],
  //         isSelected: false,
  //       });
  
  //       return acc;
  //     }, {});
  
  //     // Convertir l'objet regroupé en tableau
  //     const mainCategoryList = Object.keys(groupedByCategory).map(category => ({
  //       category,
  //       products: groupedByCategory[category],
        
  //     }));
  
  //     // Mettre à jour les états
  //     setFavoriteList1(sortedProducts);
  //     setFavoriteList2(sortedProducts);
  
  //     console.log("FavoriteList1", sortedProducts);
  //     console.log("FavoriteList2", mainCategoryList);
  
  //   } catch (error) {
  //     console.error("Error getting product data: ", error);
  //   }
  // };
  
  const getCategories = async () => {
    try {
      const result = await authApi.getCategories();
      console.log("liste des categories ",result);
     
      
    } catch (error) {
      console.error("Error getting product data: ", error);
    }
  };
  const handleRemoveFavorite = async (productId1) => {
    try {
      const userId = user._id; // Assurez-vous que user.userId est correctement défini
      console.log(" userId", userId);
      console.log("productId", productId1);
      const updatedFavorites = await authApi.removlistFavoris(userId, productId1);
      console.log("supprission de favorie",updatedFavorites)
      
      if(updatedFavorites){
        setFavoriteList1((prevFavorites) =>
          prevFavorites.filter((item) => item.productId !== productId1)
        );
         alert('Produit retiré des favoris');
         
      }
    } catch (error) {
      alert(error.message);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      getfavoriteproducts();
      // getCategories();
      // getFavorite(user._id)
      
    }, [])
  );
  const handleCategorySelect = (categoryName) => {
    setSelectedCategories(prevCategories => {
      if (prevCategories.includes(categoryName)) {
        return prevCategories.filter(category => category !== categoryName); // Retirer la catégorie si déjà sélectionnée
      } else {
        return [...prevCategories, categoryName]; // Ajouter la catégorie si non sélectionnée
      }
    });
  };

  // Fonction pour filtrer les produits en fonction des catégories sélectionnées
  const filterProductsByCategories = (selectedCategories) => {
    console.log("selectedCategories",selectedCategories)
    if (selectedCategories.length > 0) {
      const filtered = favoriteList1.filter(product => 
        selectedCategories.some(category => category.category === product.category)
      );
      setIsSearchFilterApplied(true)
      console.log("filtered",filtered);
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(favoriteList1); // Afficher tous les produits si aucune catégorie n'est sélectionnée
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.bodyContainer}>
        <FavoriteHeaderView
          isEmptyList={favoriteList1.length == 0}
          isFilterApplied={isSearchFilterApplied}
          onFilterPress={() => {
            setShowFilterModal(true)
          }}
          onPlusIconPress={() => {
            setShowAddEditCategoryModal(true)
          }}
          onClearFilterPress={() => setIsSearchFilterApplied(false)}
        />
      </View>
      {isSearchFilterApplied ? (
        <View style={styles.body}>
          <View style={styles.flxRow}>
            <AppText
              text={'Category:'}
              size='font16px'
              fontFamily='medium'
              color={colors.lightBlackSecondary}
              style={styles.categoryText}
            />
            <AppText
              text={'Skin Care, Makeup'}
              size='font16px'
              color={colors.lightBlackSecondary}
              style={[styles.categoryText]}
            />
          </View>
          <View style={styles.flxRow}>
            <AppText
              text={'Routine:'}
              size='font16px'
              fontFamily='medium'
              color={colors.lightBlackSecondary}
              style={styles.categoryText}
            />
            <AppText
              text={'Morning, Night'}
              size='font16px'
              color={colors.lightBlackSecondary}
              style={[styles.categoryText]}
            />
          </View>
         
        </View>
      ) : (
        <></>
      )}
       {favoriteList1.length === 0 && (
          
            <ProductListEmptyView
              emptyMessage={LocalesMessages.youDontHaveAnyFavorites}
              mainContainerStyle={styles.emptyViewMainContainer}
              onPressScanProduct={() => {
                setFavoriteList(FavoriteListData.favoriteList)
              }}
            />
          
        )}
      <FlatList
        data={isSearchFilterApplied ? filteredProducts:favoriteList1}
        numColumns={2}
        horizontal={false}
        style={styles.body}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <ProductItemView
              key={index}
              isFromFavoriteList={true}
              item={item}
              onPressOption={() => { setShowActionModal(true);
              setProductId(item.productId);
              setCategorie(item.category);
            }}
              onPressItem={() => {
                navigation.navigate(Route.FavoriteDetailScreen, {
                  listName: item.category,
                })
              }}
            />
          )
        }}
       
      />
      <AddCategoryPopup
       listecategorie={favoriteList2}
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
        listecategorie={favoriteList2}
        onPressClose={() => setShowFilterModal(false)}
        onApplyPress={(selectedCategories) => {
          filterProductsByCategories(selectedCategories); // Appliquer les filtres
        }}
      />
      <ActionModal
        isVisible={showActionModal}
        onPressClose={() => setShowActionModal(false)}
        onPressEditCategory={() => {
          setShowActionModal(false)
          setSelectedCategoryTitleForEdit(categorie)
          setTimeout(() => {
            setShowAddEditCategoryModal(true)
          }, 800)
        }}
        onPressDeleteCategory={() => {
          setShowActionModal(false)
          const options = [
            { text: LocalesMessages.cancel },
            {
              text: LocalesMessages.confirm,
              style: 'destructive',
              onPress: () => {handleRemoveFavorite(productId)},
            },
          ]
          Alert.alert('',LocalesMessages.areYouSureDeleteCategory, options)
        }}
      />
    </SafeAreaView>
  )
}

export default FavoriteScreen
