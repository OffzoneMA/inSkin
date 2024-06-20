import React from 'react'
import { Image, SafeAreaView, TouchableOpacity, View } from 'react-native'
import CustomHeaderView from '../../components/CustomHeaderView'
import { LocalesMessages } from '../../constants/locales'
import { colors, images } from '../../constants'
import { useSelector } from 'react-redux'
import { selectProductDetailData } from '../../redux/selector/appSelectors'
import { styles } from './styles'
import RatingView from '../../components/RatingView'
import AppText from '../../components/AppText'
import { ScrollView } from 'react-native'
import ProductReviewCard from '../../components/ProductReviewCard'
import AppCommentTextArea from '../../components/AppCommentTextArea'
import { useNavigation } from '@react-navigation/native'
import AddCategoryPopup from '../../components/Popups/AddCategoryPopup'
import { Route } from '../../constants/constants'
import useScreenTracking from '../../hooks/screenTracking'

const FeedDetailScreen = () => {
  const navigation = useNavigation()
  const productData = useSelector(selectProductDetailData)
  const [commentText, setCommentText] = React.useState('')
  const [isBookmarked, setIsBookmarked] = React.useState(false)
  const [showCategoryModal, setShowCategoryModal] = React.useState(false)
  useScreenTracking(navigation, Route.FeedDetailScreen)
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        keyboardDismissMode='interactive'>
        <CustomHeaderView
          title={LocalesMessages.countraMix}
          leftButtonImage={images.backButton}
          leftButtonOnPress={() => {
            navigation.goBack()
          }}
          rightButtonImage={images.share}
          rightButtonOnPress={() => {}}
          isFromProfileMenu={false}
        />
        <Image source={images.productDetailImage} style={styles.productImage} />
        <View style={styles.productRatingContainer}>
          <View style={styles.flexRowWithCenterItem}>
            <RatingView rating={productData[0].rating} startImageStyle={styles.ratingStarImage} />
            <AppText
              text={productData[0].rating.toFixed(1)}
              style={[styles.likeCountFont, { color: colors.black }]}
              size='font14px'
            />
            <AppText
              text={`(${productData[0].ratingsCount})`}
              style={styles.likeCountFont}
              size='font12px'
            />
          </View>
          <View style={styles.flexRowWithCenterItem}>
            <Image source={images.thumbsUp} style={styles.thumbsUpImage} />
            <AppText text={productData[0].LikeCount} style={styles.likeCountFont} size='font12px' />
            <Image source={images.eye} style={styles.eyeImage} />
            <AppText text={productData[0].viewCount} style={styles.likeCountFont} size='font12px' />
            <Image source={images.productShare} style={styles.productShareImage} />
            <AppText text={productData[0].viewCount} style={styles.likeCountFont} size='font12px' />
          </View>
        </View>
        <View style={styles.productDetailsContainer}>
          <View style={{ maxWidth: '60%' }}>
            <AppText
              text={productData[0].productName}
              style={styles.productName}
              size={'font20px'}
              fontFamily='medium'
            />
            <AppText
              text={productData[0].productSubDesc}
              style={styles.productSubDesc}
              size={'font14px'}
            />
          </View>
          <View style={styles.flexRowWithCenterItem}>
            <TouchableOpacity
              onPress={() => {
                setShowCategoryModal(true)
              }}>
              <Image
                source={isBookmarked ? images.bookmark_selected : images.bookmark}
                style={styles.bookmarkImage}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={images.heart} style={styles.heartImage} />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            marginTop: 22,
          }}>
          <AppText
            localizedText={LocalesMessages.description}
            style={styles.productName}
            size={'font18px'}
          />
          <AppText
            text={productData[0].productDesc}
            style={[styles.productSubDesc, { marginTop: 8 }]}
            size={'font14px'}
          />
        </View>
        <View
          style={[
            styles.flexRowWithCenterItem,
            { marginTop: 24, justifyContent: 'space-between' },
          ]}>
          <AppText
            localizedText={LocalesMessages.comments}
            style={styles.productName}
            size={'font18px'}
            fontFamily='medium'
          />
          <TouchableOpacity style={styles.flexRowWithCenterItem}>
            <AppText
              localizedText={LocalesMessages.mostRecent}
              style={styles.mostRecentText}
              size={'font14px'}
            />
            <Image source={images.arrowThin} style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 22,
          }}>
          {productData[0].comments.map((item, index) => (
            <ProductReviewCard key={index} item={item} />
          ))}
          <AppCommentTextArea
            placeholderText={LocalesMessages.addAComment}
            textValue={commentText}
            onChangeText={text => {
              setCommentText(text)
            }}
          />
          <View style={styles.assessmentRatingContainer}>
            <AppText
              localizedText={LocalesMessages.yourAssessment}
              size={'font12px'}
            />
            <RatingView rating={3} startImageStyle={styles.startImage} />
          </View>
        </View>
      </ScrollView>
      <AddCategoryPopup
        isFromFavorite={false}
        isVisible={showCategoryModal}
        onPressClose={() => {
          setShowCategoryModal(false)
        }}
        onPressAdd={() => {
          setIsBookmarked(true)
          setShowCategoryModal(false)
        }}
      />
    </SafeAreaView>
  )
}

export default FeedDetailScreen;
