import React, { useRef } from 'react'
import { FlatList, SafeAreaView, View } from 'react-native'
import styles from './styles'
import CustomHeaderView from '../../components/CustomHeaderView'
import { images } from '../../constants'
import { LocalesMessages } from '../../constants/locales'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ChatEmptyView from './ChatEmptyView'
import ChatHeaderDateView from './ChatHeaderDateView'
import ChatBubbleView from './ChatBubbleView'
import { useNavigation } from '@react-navigation/native'
import AppCommentTextArea from '../../components/AppCommentTextArea'
import { useAppDispatch } from '../../redux/store'
import { updateChatData } from '../../redux/slices/app/appSlice'
import { useSelector } from 'react-redux'
import { selectChatData } from '../../redux/selector/appSelectors'
import useScreenTracking from '../../hooks/screenTracking'
import { Route } from '../../constants/constants'

const SupportScreen = () => {
  const navigation = useNavigation()
  const [messageText, setMessageText] = React.useState('')
  const dispatch = useAppDispatch()
  const chatData = useSelector(selectChatData)
  const flatListRef = useRef()
  useScreenTracking(navigation, Route.SupportScreen)
  const onPressSendButton = () => {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (messageText.length > 0) {
      dispatch(
        updateChatData([{ isSender: true, message: messageText, sentTime: currentTime }, ...chatData]),
      )
      setMessageText('')
      flatListRef.current.scrollToIndex({
        animated: true,
        index: chatData.length - 1,
      })
    }
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.mainContainer]}>
        <CustomHeaderView
          leftButtonImage={images.backButton}
          title={LocalesMessages.support}
          leftButtonOnPress={() => {
            navigation.goBack()
          }}
          isFromProfileMenu={true}
        />
        <KeyboardAwareScrollView
          contentContainerStyle={[styles.scrollView]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.bodyContainer}>
            <FlatList
              ref={flatListRef}
              data={chatData}
              style={styles.flatlist}
              contentContainerStyle={styles.flatlistContainer}
              inverted={chatData.length > 0}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => {
                return <ChatEmptyView />
              }}
              ListFooterComponent={() => {
                return <ChatHeaderDateView />
              }}
              renderItem={({ item, index }) => {
                return <ChatBubbleView index={index} item={item} />
              }}
            />
            <AppCommentTextArea
              placeholderText=''
              textValue={messageText}
              mainContainerStyle={{ marginTop: 20 }}
              onPressSendButton={onPressSendButton}
              onChangeText={text => {
                setMessageText(text)
              }}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  )
}

export default SupportScreen
