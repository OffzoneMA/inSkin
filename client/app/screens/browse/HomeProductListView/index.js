import { Image, TouchableOpacity, View , Text} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Route } from '../../../constants/constants'
import { colors, images } from '../../../constants'
import AppText from '../../../components/AppText'
import RatingView from '../../../components/RatingView'
import { styles } from './styles'
import { LocalesMessages } from '../../../constants/locales'
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from "@react-navigation/native";
const HomeProductListView = ({ item, onPressBookMark,onPressproduct,isBookmarked }) => {
  const navigation = useNavigation()
  const imageSource = item.images && item.images.length > 0 
  ? { uri: `data:${item.images[0].contentType};base64,${item.images[0].data}` }
  : null; // Si `item.images` est vide ou non défini, imageSource est `null`
  const imageSourcep = item. profileImage && item. profileImage.length > 0 
  ? { uri: `data:${item. profileImage[0].contentType};base64,${item. profileImage[0].data}` }
  : null;
  const comments = item.comments && item.comments.length > 0 
    ? item.comments 
    : [];
    
    
  
return (
  <>
    <View style={styles.cardContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPressproduct}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.productImage}
          />
        ) : (
          <Image source={images.homeCarouselAvatar} style={styles.productImage} /> // Message à afficher si aucune image n'est disponible
        )}
      </TouchableOpacity>
        <View style={styles.postDetails}>
        <View style={styles.postDetails}>
              
            <AppText
              text={item.productName}
              style={styles.productNameText}
              size='font16px'
              fontFamily='medium'
            />
            <AppText
              text="chanel"
              color={colors.tabBarGray}
              style={styles.postBrand}
              size='font12px'
            />
          </View>
          <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton}  onPress={onPressBookMark}>
          <Icon
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={isBookmarked ? 'blue' : '#000'}
      />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="chatbubble-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>
        </View>
        <View style={styles.userInfo}>
        
        {imageSourcep ? (
          <Image
            source={imageSourcep}
            style={styles.userAvatar}
          />
        ) : (
          <Image source={images.userAvatar} style={styles.userAvatar} /> // Message à afficher si aucune image n'est disponible
        )}
        <View>
         <View style={styles.iconContainer}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.postDate}>{item.createdAt}</Text>
          </View>
           <RatingView rating={4} startImageStyle={styles.ratingViewContainer} />
        </View>
      </View>
      {comments.map((comment, index) => (
          <View key={index} style={styles.commentContainer}>
            <AppText
              text={comment.text} // Affichage du texte du commentaire
              style={styles.commentText}
              size='font14px'
            />
            
          </View>
        ))}
        <View style={styles.productLikeContainer}>
          <TouchableOpacity>
            <Image source={images.upTriangle} style={styles.productLikeButton} />
          </TouchableOpacity>
          <AppText text='12k' size='font12px' style={styles.productLikeCountText} />
          <TouchableOpacity>
            <Image
              source={images.upTriangle}
              style={[
                styles.productLikeButton,
                { transform: [{ rotate: '180deg' }], opacity: 0.8, marginLeft: 5 },
              ]}
            />
          </TouchableOpacity>
          <AppText text='8k' size='font12px' style={styles.productLikeCountText} />
        </View>
      </View>
      <View style={styles.dividerView} />
    </>
  )
}

export default HomeProductListView
