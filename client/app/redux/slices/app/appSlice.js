import { createSlice } from "@reduxjs/toolkit";

import productData from '../../../../data/productData.json'
import supportChatData from '../../../../data/supportChatData.json'

export const initialState = {
  isLoggedIn: false,
  productDetail: productData.productList,
  supportChatData: supportChatData.chatData,
  notificationSettingOptions: {
    push: false,
    sms: false,
    email: false,
    whenPeopleFollow: false,
    whenNewProductAdd: false,
    whenBestProductAdd: false,
  },
  userProfile: {
    userName: 'Mr.Michael',
    firstName: 'Michael',
    lastName: 'Alfred',
    email: 'michaelalf@gmail.com',
    phoneNumber: '+1 (555) 000-0000',
  },
  socialMediaLinks: {
    tickTok: '',
    instagram: '',
  },
  currentScreen: ''
}
export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateLoginStatus(state, action) {
      state.isLoggedIn = action.payload;
    },
    updateChatData(state, action) {
      state.supportChatData = action.payload;
    },
    updateNotificationSetting(state, action) {
      state.notificationSettingOptions = action.payload;
    },
    updateUserProfile(state, action) {
      state.userProfile = action.payload;
    },
    updateSocialMediaLink(state, action) {
      state.socialMediaLinks = action.payload;
    },
    updateCurrentScreen(state, action) {
      state.currentScreen = action.payload;
    },
  },
});
export const {
  updateLoginStatus,
  updateChatData,
  updateNotificationSetting,
  updateSocialMediaLink,
  updateUserProfile,
  updateCurrentScreen,
} = appSlice.actions

export default appSlice.reducer;
