import React, { useContext, useState } from 'react'
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

const FavoriteScreen = () => {
  const navigation = useNavigation()
  const { translate } = useContext(LocalizationContext)
  const [favoriteList, setFavoriteList] = useState([])
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showAddEditCategoryModal, setShowAddEditCategoryModal] = useState(false)
  const [selectedCategoryTitleForEdit, setSelectedCategoryTitleForEdit] = useState('')
  const [showActionModal, setShowActionModal] = useState(false)
  const [isSearchFilterApplied, setIsSearchFilterApplied] = useState(false)
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.bodyContainer}>
        <FavoriteHeaderView
          isEmptyList={favoriteList.length == 0}
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
      <FlatList
        data={isSearchFilterApplied ? FavoriteFilterData.favoriteList : favoriteList}
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
              onPressOption={() => setShowActionModal(true)}
              onPressItem={() => {
                navigation.navigate(Route.FavoriteDetailScreen, {
                  listName: item.favoriteListName,
                })
              }}
            />
          )
        }}
        ListEmptyComponent={() => {
          return (
            <ProductListEmptyView
              emptyMessage={LocalesMessages.youDontHaveAnyFavorites}
              mainContainerStyle={styles.emptyViewMainContainer}
              onPressScanProduct={() => {
                setFavoriteList(FavoriteListData.favoriteList)
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

export default FavoriteScreen
