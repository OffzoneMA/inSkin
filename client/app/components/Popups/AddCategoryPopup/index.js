import { Image, View } from 'react-native';
import React, { useState } from 'react';
import ReactNativeModal from 'react-native-modal';
import AppText from '../../AppText';
import { LocalesMessages } from '../../../constants/locales';
import { colors, images } from '../../../constants';
import bookmarkCategories from '../../../../data/bookmarkCategories.json';
import AppIconButton from '../../AppIconButton';
import AppButton from '../../AppButton';
import styles from './styles';
import CategoryOptionView from './CategoryOptionView';
import ProfileOptionView from '../../ProfileOptionView';
import AppTextInput from '../../AppTextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const AddCategoryPopup = ({ isVisible = false, onPressClose, onPressAdd, onPressAdd1,isFromFavorite, editTitle = '',onChangeText,listecategorie,onPresscate }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState('');
  const [isSelectedCheckBox, setIsSelectedCheckBox] = useState(false);
  const [categoryName, setCategoryName] = useState(editTitle);
  const [categoryList, setCategoryList] =  useState(listecategorie || []);
  console.log("categoryList",categoryList);
  console.log("listecategorie",listecategorie);
  
  return (
    <ReactNativeModal
      isVisible={isVisible}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      onModalWillShow={() => {
        setSelectedCategory(null);
        setCategoryName(editTitle); // Remplacez '' par editTitle pour pré-remplir le champ avec la valeur de l'édition
        setIsSelectedCheckBox(false);
      }}
      style={styles.modal}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        bounces={false}
        scrollEnabled={isFromFavorite}
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
            {isFromFavorite ? (
              <>
                <AppTextInput
                  placeholderText={LocalesMessages.enterTitleOfYourCategory}
                  value={categoryName}
                  onChangeText={text => {
                    setCategoryName(text);
                    if (onChangeText) onChangeText(text); // Appel à la fonction de rappel
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
                    setIsSelectedCheckBox(!isSelectedCheckBox);
                  }}
                  isHideDivider={true}
                />
              </>
            ) : (
              <>
                {listecategorie.map(value => (
                  <CategoryOptionView
                    key={value.id} // Ajoutez une clé unique pour chaque élément de la liste
                    value={value}
                    selectedCategory={selectedCategory}
                    onPressOption={(category) => {
                      console.log("category", category);
                      setSelectedCategory(category);
                      setSelectedCategoryTitle(category); // Capture le texte de la catégorie
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
                  onPress={() => {}}
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
                if(isFromFavorite){
                  onPressAdd1();
                }else{
                  onPressAdd(selectedCategory);
                }
               
                // Vous pouvez également appeler onPressAdd ici avec des paramètres, si nécessaire
              }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ReactNativeModal>
  );
};

export default AddCategoryPopup;
