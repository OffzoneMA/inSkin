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

const FavoriteDetailScreen = () => {
  const navigation = useNavigation()
  const { translate } = useContext(LocalizationContext)
  const route = useRoute()
  const listName = route.params.listName ?? ''
  const [productList, setProductList] = useState([])
  const [showAddEditCategoryModal, setShowAddEditCategoryModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const productData = useSelector(selectProductDetailData)
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
              />
            )
          }}
          ListEmptyComponent={() => {
            return (
              <ProductListEmptyView
                emptyMessage={LocalesMessages.youDontHaveAnyFavorites}
                mainContainerStyle={styles.emptyViewMainContainer}
                buttonTitle={LocalesMessages.scanAddProduct}
                buttonStyle={{ width: 200 }}
                onPressScanProduct={() => {
                  setProductList(productData)
                }}
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
            { text: translate(LocalesMessages.cancel) },
            {
              text: translate(LocalesMessages.confirm),
              style: 'destructive',
              onPress: () => {},
            },
          ]
          Alert.alert('', translate(LocalesMessages.areYouSureDeleteProduct), options)
        }}
      />
    </SafeAreaView>
  )
}

export default FavoriteDetailScreen;
