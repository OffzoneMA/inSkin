import React, { useState } from 'react'
import { FlatList, SafeAreaView, ScrollView, View } from 'react-native'
import ProfileFollowerView from './ProfileFollowerView'
import styles from './styles'
import CustomHeaderView from '../../components/CustomHeaderView'
import { images } from '../../constants'
import ProductItemView from '../../components/ProductItemView'
import ProductListEmptyView from '../../components/ProductListEmptyView'
import { useNavigation } from '@react-navigation/native'
import { Route } from '../../constants/constants'
import { useSelector } from 'react-redux'
import { selectProductDetailData } from '../../redux/selector/appSelectors'
import { LocalesMessages } from '../../constants/locales'

const ProfileScreen = () => {

  const navigation = useNavigation()
  const productData = useSelector(selectProductDetailData)
  const [productList, setProductList] = useState([])
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <CustomHeaderView
            rightButtonImage={images.myProfile}
            rightButtonOnPress={() => {
              navigation.navigate(Route.MyProfileScreen)
            }}
          />
          <ProfileFollowerView
            onPressEditProfile={() => {
              navigation.navigate(Route.PersonalDetailScreen)
            }}
          />
          <FlatList
            data={productList}
            scrollEnabled={false}
            numColumns={2}
            style={styles.flatList}
            contentContainerStyle={styles.flatListContainer}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return <ProductItemView index={index} item={item} onPressOption={() => {}} />
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
  )
}

export default ProfileScreen;
