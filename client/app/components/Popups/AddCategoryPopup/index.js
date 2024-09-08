import { Image, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import ReactNativeModal from 'react-native-modal';
import AppText from '../../AppText';
import { LocalesMessages } from '../../../constants/locales';
import { colors, images } from '../../../constants';
import AppIconButton from '../../AppIconButton';
import AppButton from '../../AppButton';
import styles from './styles';
import CategoryOptionView from './CategoryOptionView';
import ProfileOptionView from '../../ProfileOptionView';
import AppTextInput from '../../AppTextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const AddCategoryPopup = ({ isVisible = false, onPressClose, onPressAdd, onPressAdd1, isFromFavorite, editTitle = '', onChangeText, listecategorie, isFromEdite }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState('');
  const [isSelectedCheckBox, setIsSelectedCheckBox] = useState(false);
  const [categoryName, setCategoryName] = useState(editTitle);
  const [categoryList, setCategoryList] = useState(listecategorie || []);
  const [isEditingFavorite, setIsEditingFavorite] = useState(isFromFavorite);

  useEffect(() => {
    setCategoryList(listecategorie || []);
  }, [listecategorie]);

  useEffect(() => {
    setCategoryName(editTitle);
  }, [editTitle]);

  return (
    <ReactNativeModal
      isVisible={isVisible}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      onModalWillShow={() => {
        setSelectedCategory(null);
        setCategoryName(editTitle); // Set category name from editTitle if editing
        setIsSelectedCheckBox(false);
      }}
      style={styles.modal}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        bounces={false}
        scrollEnabled={isEditingFavorite}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          <View style={styles.headerContainer}>
            <AppText
              text={LocalesMessages.addCategory}
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
            {isEditingFavorite ? (
              <>
                <AppTextInput
                  placeholderText={LocalesMessages.enterTitleOfYourCategory}
                  value={categoryName}
                  onChangeText={text => {
                    setCategoryName(text);
                    if (onChangeText) onChangeText(text); // Call onChangeText callback
                  }}
                />
                <ProfileOptionView
                  leftImageSource={isSelectedCheckBox ? images.selectedcheckBox : images.checkBox}
                  leftImageStyle={[styles.plusImage, isEditingFavorite && styles.checkboxImage]}
                  titleText={LocalesMessages.forMeOnly}
                  titleTextStyle={styles.createText}
                  mainContainerStyle={styles.createMainContainer}
                  leftImageTitleContainerStyle={styles.createLeftImageTitleContainer}
                  onPress={() => {
                    setIsSelectedCheckBox(!isSelectedCheckBox);
                  }}
                  isHideDivider={true}
                />
              </>
            ) : (
              <>
                {categoryList.map(value => (
                  <CategoryOptionView
                    key={value.id} // Use unique key for each category
                    value={value}
                    selectedCategory={selectedCategory}
                    onPressOption={(category) => {
                      console.log("Selected category:", selectedCategory);
                      setSelectedCategory(category);
                      setSelectedCategoryTitle(category);
                    }}
                  />
                ))}
                <ProfileOptionView
                  leftImageSource={images.plusIcon}
                  leftImageStyle={styles.plusImage}
                  titleText={LocalesMessages.createCategory}
                  titleTextStyle={styles.createText}
                  mainContainerStyle={styles.createMainContainer}
                  leftImageTitleContainerStyle={styles.createLeftImageTitleContainer}
                  onPress={() => setIsEditingFavorite(true)} // Switch to create category mode
                  isHideDivider={true}
                />
              </>
            )}
            <AppButton
              localizedText={LocalesMessages.add}
              buttonStyle={styles.confirmButton}
              labelStyle={[styles.confirmButtonText, styles.fontWeight500]}
              isDisable={!selectedCategory && !categoryName}
              onPress={() => {
                if (isEditingFavorite) {
                  onPressAdd1();
                  setIsEditingFavorite(false)
                } else {
                  onPressAdd(selectedCategory);
                }
              }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ReactNativeModal>
  );
};

export default AddCategoryPopup;
