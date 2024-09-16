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

const AddCategoryPopup1 = ({ isVisible = false, onPressClose, onPressAdd, onPressAdd1, isFromFavorite, editTitle = '', onChangeText, listecategorie, isFromEdite }) => {
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
              text="Ajouter une marque de produit"
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
              
                <AppTextInput
                  placeholderText="Entrez le nom de la marque"
                  value={categoryName}
                  onChangeText={text => {
                    setCategoryName(text);
                    if (onChangeText) onChangeText(text); // Call onChangeText callback
                  }}
                />
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

export default AddCategoryPopup1;
