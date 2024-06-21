import React, { useState } from 'react'
import { FlatList, SafeAreaView, View } from 'react-native'
import { styles } from './styles'
import HomeHeader from '../../components/HomeHeader'
import productData from '../../../data/productData.json'
// client\app\data
// client\app\data\productData.json
// client\app\screens\HomeScreen\index.js
// import productData from '/../../data/productData.json'
import AppText from '../../components/AppText'
import HomeCarousel from '../../components/HomeCarousel'
import HomeProductListView from './HomeProductListView'
import { LocalesMessages } from '../../constants/locales'

const  HomeScreen= () => {
  const [isShowProductList, setIsShowProductList] = useState(false)
  return (
    <SafeAreaView style={styles.mainContainer}>
      <HomeHeader />
      <>
        {isShowProductList ? (
          <FlatList
            data={productData.productList}
            renderItem={({ item }) => {
              return <HomeProductListView item={item} onPressBookMark={() => {}} />
            }}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View>
            <View style={styles.headerTitleContainer}>
              <AppText
                localizedText={LocalesMessages.welcomeToInSkin}
                fontFamily='medium'
                size='font22px'
                style={styles.welcomeTagLine}
              />
              <AppText
                localizedText={LocalesMessages.followPeopleToStartSeeingThe}
                size='font14px'
                style={[styles.welcomeSubTagLine, { marginTop: 12 }]}
              />
              <AppText
                localizedText={LocalesMessages.productsAndPostsTheyShare}
                size='font14px'
                style={styles.welcomeSubTagLine}
              />
            </View>
            <HomeCarousel
              onFollowButtonPress={() => {
                setIsShowProductList(true)
              }}
            />
          </View>
        )}
      </>
    </SafeAreaView>
  )
}

export default HomeScreen;
