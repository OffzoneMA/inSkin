import { TouchableOpacity, View } from 'react-native'
import React from 'react'
import AppText from '../../../components/AppText'
import { LocalesMessages } from '../../../constants/locales'
import { colors, images } from '../../../constants'
import AppIconButton from '../../../components/AppIconButton'
import { styles } from './styles'

const FavoriteHeaderView = ({
  isEmptyList,
  onPlusIconPress,
  onFilterPress,
  isFilterApplied,
  onClearFilterPress,
}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={[styles.titleContainer, { alignItems: isEmptyList ? 'center' : 'flex-start' }]}>
        <AppText
          localizedText={LocalesMessages.favorites}
          size='font18px'
          fontFamily='medium'
        />
      </View>

      <View style={styles.rightButtonsContainer}>
        {isEmptyList ? (
          <></>
        ) : isFilterApplied ? (
          <View style={styles.removeFilterContainerMain}>
            <TouchableOpacity onPress={onClearFilterPress} style={styles.removeFilterContainer}>
              <AppIconButton imageSource={images.clearFilter} imageStyle={styles.clearFilterIcon} />
              <AppText
                localizedText={LocalesMessages.clearFilter}
                size='font16px'
                color={colors.tabBarGray}
                style={styles.clearFilter}
              />
            </TouchableOpacity>
            <View style={styles.divider} />
          </View>
        ) : (
          <TouchableOpacity onPress={onFilterPress} style={styles.filterButtonContainer}>
            <AppText
              localizedText={LocalesMessages.filter}
              size='font18px'
              color={colors.tabBarGray}
            />
          </TouchableOpacity>
        )}
        <AppIconButton
          imageSource={images.plusIcon}
          imageStyle={styles.plusImage}
          imageContainerStyle={styles.plusImageContainer}
          onPress={() => onPlusIconPress()}
        />
      </View>
    </View>
  )
}

export default FavoriteHeaderView;
