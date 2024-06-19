/**
 * add keys to use multi language in app
 * add key in localMessages and values in respective languages
 * */
export const LocalesMessages = Object.freeze({
  greeting: 'greeting',
  editProfile: 'editProfile',
  followers: 'followers',
  posts: 'posts',
  oops: 'oops',
  youHaveToCommentOrRateProduct: 'youHaveToCommentOrRateProduct',
  scanProduct: 'scanProduct',
  scanAddProduct: 'scanAddProduct',
  profile: 'profile',
  personalDetail: 'personalDetail',
  personalDetailSmall: 'personalDetailSmall',
  personalDetailDesc: 'personalDetailDesc',
  socialMediaProfile: 'socialMediaProfile',
  socialMediaProfileSmall: 'socialMediaProfileSmall',
  socialMediaProfileDesc: 'socialMediaProfileDesc',
  notifications: 'notifications',
  notificationsDesc: 'notificationsDesc',
  settings: 'settings',
  settingsDesc: 'settingsDesc',
  legal: 'legal',
  legalDesc: 'legalDesc',
  logout: 'logout',
  editConfirmYourPersonalInformation: 'editConfirmYourPersonalInformation',
  userName: 'userName',
  firstName: 'firstName',
  lastName: 'lastName',
  emailAddress: 'emailAddress',
  phoneNumber: 'phoneNumber',
  confirm: 'confirm',
  legalInformation: 'legalInformation',
  termsOfUse: 'termsOfUse',
  legalNotice: 'legalNotice',
  privacyPolicy: 'privacyPolicy',
  cookiePolicy: 'cookiePolicy',
  socialMediaProfiles: 'socialMediaProfiles',
  TIkTok: 'TIkTok',
  enterYourProfileLink: 'enterYourProfileLink',
  Instagram: 'Instagram',
  areYouSureYouWantLeaveTheApp: 'areYouSureYouWantLeaveTheApp',
  cancel: 'cancel',
  changePassword: 'changePassword',
  support: 'support',
  rateTheAppOnAppStore: 'rateTheAppOnAppStore',
  termsOfService: 'termsOfService',
  deactivateAccount: 'deactivateAccount',
  areYouSureYouWantDeleteYourAccount: 'areYouSureYouWantDeleteYourAccount',
  yourPassword: 'yourPassword',
  enterYourCurrentPassword: 'enterYourCurrentPassword',
  continue: 'continue',
  yourNewPassword: 'yourNewPassword',
  enterYourNewPassword: 'enterYourNewPassword',
  confirmPassword: 'confirmPassword',
  confirmYourNewPassword: 'confirmYourNewPassword',
  yourPasswordHasBeenSuccessfullyChanged: 'yourPasswordHasBeenSuccessfullyChanged',
  OK: 'OK',
  youHaveNoMessages: 'youHaveNoMessages',
  helloHowCanWeHelpYou: 'helloHowCanWeHelpYou',
  goodAfternoonDonKnowHowContactTheDriverTheLastTripThink:
    'goodAfternoonDonKnowHowContactTheDriverTheLastTripThink',
  Push: 'Push',
  Enabled: 'Enabled',
  Disabled: 'Disabled',
  SMS: 'SMS',
  Email: 'Email',
  whenPeopleFollowAddProduct: 'whenPeopleFollowAddProduct',
  whenNewProductAddedTheList: 'whenNewProductAddedTheList',
  whenProductNotedAsBestProductStars: 'whenProductNotedAsBestProductStars',
  pushNotifications: 'pushNotifications',
  accountActivity: 'accountActivity',
  countraMix: 'countraMix',
  addAComment: 'addAComment',
  addToCategory: 'addToCategory',
  createCategory: 'createCategory',
  add: 'add',
  favorites: 'favorites',
  youDontHaveAnyFavorites: 'youDontHaveAnyFavorites',
  filter: 'filter',
  addCategory: 'addCategory',
  enterTitleOfYourCategory: 'enterTitleOfYourCategory',
  forMeOnly: 'forMeOnly',
  action: 'action',
  editCategoryInfo: 'editCategoryInfo',
  deleteCategory: 'deleteCategory',
  areYouSureDeleteCategory: 'areYouSureDeleteCategory',
  shareProduct: 'shareProduct',
  deleteProduct: 'deleteProduct',
  areYouSureDeleteProduct: 'areYouSureDeleteProduct',
  category: 'category',
  apply: 'apply',
  clearFilter: 'clearFilter',
  description: 'description',
  comments: 'comments',
  mostRecent: 'mostRecent',
  yourAssessment: 'yourAssessment',
  welcomeToInSkin: 'welcomeToInSkin',
  followPeopleToStartSeeingThe: 'followPeopleToStartSeeingThe',
  productsAndPostsTheyShare: "productsAndPostsTheyShare",
  chanel: "chanel",
  goToPost: "goToPost"
})

// export const LocalesMessagesType = { [key in LocalesMessages]: string }

/**
 * all the supported languages by app
 * */
// INFO: this is for demo will add actual language after confirmation
export const Languages = 'en'

/**
 * add the same key defined into LocaleMessages object
 * and add value which you want to display when the particular language is selected by user
 * */

const locales = {
  /**********ENGLISH START HERE********/
  en: {
    greeting: 'Hi!',
    editProfile: 'Edit Profile',
    followers: 'Followers',
    posts: 'Posts',
    oops: 'Oops',
    youHaveToCommentOrRateProduct: 'You have to comment or rate a product',
    scanProduct: 'Scann a product',
    profile: 'Profile',
  },
  /**********ENGLISH ENDS HERE********/
}
export default locales
