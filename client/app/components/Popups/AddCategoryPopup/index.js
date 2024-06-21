import { Image, View } from 'react-native'
import React, { useState } from 'react'
import ReactNativeModal from 'react-native-modal'
import AppText from '../../AppText'
import { LocalesMessages } from '../../../constants/locales'
import { colors, images } from '../../../constants'
import bookmarkCategories from '../../../../data/bookmarkCategories.json'
import AppIconButton from '../../AppIconButton'
import AppButton from '../../AppButton'
import styles from './styles'
import CategoryOptionView from './CategoryOptionView'
import ProfileOptionView from '../../ProfileOptionView'
import AppTextInput from '../../AppTextInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const AddCategoryPopup = ({ isVisible = false, onPressClose, onPressAdd, isFromFavorite, editTitle = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState(undefined)
  const [isSelectedCheckBox, setIsSelectedCheckBox] = useState(false)
  const [categoryName, setCategoryName] = useState(editTitle)
  return (
    <ReactNativeModal
      isVisible={isVisible}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      onModalWillShow={() => {
        setSelectedCategory(undefined)
        setCategoryName('')
        setIsSelectedCheckBox(false)
      }}
      style={styles.modal}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        bounces={false}
        scrollEnabled={isFromFavorite}
        showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <AppText
              localizedText={LocalesMessages.addCategory}
              size='font15px'
              fontFamily='medium'
              color={colors.inputTextColor}
            />
            <AppIconButton
              imageSource={images.close}
              imageStyle={styles.closeImage}
              imageContainerStyle={[styles.closeImageContainer]}
              onPress={onPressClose}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.bodyContainer}>
            {isFromFavorite ? (
              <>
                <AppTextInput
                  placeholderText={LocalesMessages.enterTitleOfYourCategory}
                  value={categoryName}
                  onChangeText={text => {
                    setSelectedCategory(text)
                    setCategoryName(text)
                  }}
                />
                <ProfileOptionView
                  leftImageSource={isSelectedCheckBox ? images.selectedcheckBox : images.checkBox}
                  leftImageStyle={[styles.plusImage, isFromFavorite && styles.checkboxImage]}
                  titleText={LocalesMessages.forMeOnly}
                  titleTextStyle={styles.createText}
                  mainContainerStyle={styles.createMainContainer}
                  leftImageTitleContainerStyle={styles.createLeftImageTitleContainer}
                  onPress={() => {
                    setIsSelectedCheckBox(!isSelectedCheckBox)
                  }}
                  isHideDivider={true}
                />
              </>
            ) : (
              <>
                {bookmarkCategories.bookmarkCategories.map(value => {
                  return (
                    <CategoryOptionView
                      value={value}
                      selectedCategory={selectedCategory}
                      onPressOption={() => {
                        setSelectedCategory(value.id)
                      }}
                    />
                  )
                })}
                <ProfileOptionView
                  leftImageSource={images.plusIcon}
                  leftImageStyle={styles.plusImage}
                  titleText={LocalesMessages.createCategory}
                  titleTextStyle={styles.createText}
                  mainContainerStyle={styles.createMainContainer}
                  leftImageTitleContainerStyle={styles.createLeftImageTitleContainer}
                  onPress={() => {}}
                  isHideDivider={true}
                />
              </>
            )}
            <AppButton
              localizedText={LocalesMessages.add}
              buttonStyle={styles.confirmButton}
              labelStyle={[styles.confirmButtonText, styles.fontWeight500]}
              isDisable={!selectedCategory}
              onPress={onPressAdd}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ReactNativeModal>
  )
}

export default AddCategoryPopup
