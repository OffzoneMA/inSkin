import React, { useState } from 'react'
import { FlatList, Image, TouchableOpacity, View } from 'react-native'
import ReactNativeModal from 'react-native-modal'
import styles from './styles'
import AppText from '../../../components/AppText'
import { colors, images } from '../../../constants'
import { LocalesMessages } from '../../../constants/locales'
import AppButton from '../../../components/AppButton'
import FavoriteListData from '../../../../data/favoriteData.json'

const FilterModal = ({ isVisible = false, onPressClose, onApplyPress }) => {
  const mainCategoryList = FavoriteListData.favoriteList.map(value => {
    return {
      ...value,
      isSelected: false,
    }
  })
  const [categoryList, setCategoryList] = useState(mainCategoryList)
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.categoryContainer}
        onPress={() => {
          const arrFiltered = categoryList.map(value => {
            if (value.favoriteListName == item.favoriteListName) {
              value.isSelected = !item.isSelected
            }
            return {
              ...value,
            }
          })
          setCategoryList(arrFiltered)
        }}>
        <AppText text={item.favoriteListName} size='font14px' color={colors.lightBlack} />
        <Image
          source={item.isSelected ? images.selectedcheckBox : images.checkBox}
          style={styles.checkBoxImage}
        />
      </TouchableOpacity>
    )
  }
  return (
    <ReactNativeModal
      isVisible={isVisible}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      hasBackdrop={true}
      backdropTransitionOutTiming={400}
      onBackdropPress={onPressClose}
      swipeDirection={'down'}
      onModalWillShow={() => {
        setCategoryList(mainCategoryList)
      }}
      style={styles.modal}>
      <View style={styles.mainContainer}>
        <View style={styles.dividerTop} />
        <AppText
          localizedText={LocalesMessages.filter}
          size='font18px'
          style={styles.title}
          fontFamily='medium'
        />
        <View style={styles.headerContainer}>
          <AppText
            localizedText={LocalesMessages.category}
            size='font16px'
            fontFamily='medium'
            color={colors.lightBlackSecondary}
          />
        </View>
        <View style={styles.divider} />
        <FlatList data={categoryList} renderItem={item => renderItem(item)} />
        <View style={styles.divider} />
        <AppButton
          localizedText={LocalesMessages.apply}
          buttonStyle={styles.confirmButton}
          labelStyle={[styles.confirmButtonText]}
          isDisable={
            categoryList.filter(value => {
              return value.isSelected
            }).length == 0
          }
          onPress={() => {
            onApplyPress()
            onPressClose()
          }}
        />
      </View>
    </ReactNativeModal>
  )
}
export default FilterModal;
