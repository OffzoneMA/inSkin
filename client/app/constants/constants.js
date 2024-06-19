import { Dimensions, Platform } from 'react-native'
import { images } from '.'
import { LocalesMessages } from './locales'

const { height, width } = Dimensions.get('window')

export const isIOS = Platform.OS === 'ios'
export const APP_BUTTON_DEFAULT_HIGHT = 50
export const APP_BUTTON_DEFAULT_MIN_WIDTH = 100

export const ASPECT_RATIO = width / height
/**
 * Founts are used in app
 * */
export const FountsEnum = Object.freeze({
  PrimaryRegular: 'Inter-Regular',
  PrimaryBold: 'Inter-Bold',
  PrimaryMedium: 'Inter-Medium',
  PrimarySemiBold: 'Inter-SemiBold',
  PrimaryExtraBold: 'Inter-ExtraBold',
  PrimaryBlack: 'Inter-Black',
  PrimaryExtraLight: 'Inter-ExtraLight',
  PrimaryLight: 'Inter-Light',
  PrimaryThin: 'Inter-Thin',
})
export const deviceWidth = Dimensions.get('window').width
export const deviceHeight = Dimensions.get('window').height

/**
 * these are route used in app navigation
 * */
export const RouteNavigator = Object.freeze({
  HomeNavigator: 'HomeNavigator',
  SearchNavigator: 'SearchNavigator',
  FavoriteNavigator: 'FavoriteNavigator',
  MyPostNavigator: 'MyPostNavigator',
  ProfileNavigator: 'ProfileNavigator',
  TabNavigator: 'TabNavigator',
})

/***
 * Route: all screens
 */

export const Route = Object.freeze({
  HomeScreen: 'HomeScreen',
  FeedDetailScreen: 'FeedDetailScreen',
  NotificationListScreen: 'NotificationListScreen',
  FavoriteScreen: 'FavoriteScreen',
  FavoriteDetailScreen: 'FavoriteDetailScreen',
  ProfileScreen: 'ProfileScreen',
  MyProfileScreen: 'MyProfileScreen',
  PersonalDetailScreen: 'PersonalDetailScreen',
  SocialMediaListScreen: 'SocialMediaListScreen',
  LegalInfoScreen: 'LegalInfoScreen',
  WebViewScreen: 'WebViewScreen',
  SettingScreen: 'SettingScreen',
  ChangePasswordScreen: 'ChangePasswordScreen',
  SupportScreen: 'SupportScreen',
  NotificationOptionsScreen: 'NotificationOptionsScreen',
  PushNotificationScreen: 'PushNotificationScreen',
  SearchScreen: 'SearchScreen',
  MyPostScreen: 'MyPostScreen',
})

export const myProfileOptions = [
  {
    leftImage: images.personalDetail,
    titleText: LocalesMessages.personalDetail,
    descText: LocalesMessages.personalDetailDesc,
  },
  {
    leftImage: images.socialMediaProfile,
    titleText: LocalesMessages.socialMediaProfile,
    descText: LocalesMessages.socialMediaProfileDesc,
  },
  {
    leftImage: images.notificationsProfile,
    titleText: LocalesMessages.notifications,
    descText: LocalesMessages.notificationsDesc,
  },
  {
    leftImage: images.settingLegal,
    titleText: LocalesMessages.settings,
    descText: LocalesMessages.settingsDesc,
  },
  {
    leftImage: images.settingLegal,
    titleText: LocalesMessages.legal,
    descText: LocalesMessages.legalDesc,
  },
  {
    leftImage: images.logout,
    titleText: LocalesMessages.logout,
    isHideDivider: true,
  },
]
export const settingOptions = [
  {
    titleText: LocalesMessages.changePassword,
  },
  {
    titleText: LocalesMessages.support,
  },
  {
    titleText: LocalesMessages.rateTheAppOnAppStore,
  },
  {
    titleText: LocalesMessages.termsOfService,
  },
  {
    titleText: LocalesMessages.notifications,
  },
  {
    titleText: LocalesMessages.deactivateAccount,
  },
]
export const notificationOptions = [
  {
    titleText: LocalesMessages.Push,
  },
  {
    titleText: LocalesMessages.SMS,
  },
  {
    titleText: LocalesMessages.Email,
  },
  {
    titleText: LocalesMessages.whenPeopleFollowAddProduct,
  },
  {
    titleText: LocalesMessages.whenNewProductAddedTheList,
  },
  {
    titleText: LocalesMessages.whenProductNotedAsBestProductStars,
  },
]
export const termsHTMLContent = `
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <title></title>
  <meta name="Generator" content="Cocoa HTML Writer">
  <meta name="CocoaVersion" content="2487.3">
  <style type="text/css">
    p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 24.0px Helvetica; -webkit-text-stroke: #000000}
    p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; font: 24.0px Times; -webkit-text-stroke: #000000; min-height: 29.0px}
    p.p3 {margin: 0.0px 0.0px 0.0px 0.0px; font: 24.0px Helvetica; -webkit-text-stroke: #000000; min-height: 29.0px}
    p.p4 {margin: 0.0px 0.0px 0.0px 0.0px; font: 24.0px Helvetica; color: #e9004a; -webkit-text-stroke: #e9004a}
    span.s1 {font-kerning: none}
  </style>
</head>
<body>
<p class="p1"><span class="s1">Terms of Use</span></p>
<p class="p1"><span class="s1">—————————————</span></p>
<p class="p1"><span class="s1">L'accès à l'application InSkin (ci-après,l’«Application»), la navigation sur celle-ci, et l'utilisation des servicesfournis par InSkin sont régis par les conditions générales d'utilisation (« CGU») détaillées ci-dessous.</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">L'Application est la propriété exclusivede la société OFFZONE, immatriculée au Registre du Commerce et des Sociétés de Tazasous le numéro 6429, et dont le siège social situé à Avenue TarikBouhadli TAHLA, Taza.</span></p>
<p class="p3"><span class="s1"></span><br></p>
<p class="p4"><span class="s1">Préambule</span></p>
<p class="p3"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">Tout utilisateur de l'Applicationreconnaît avoir pris connaissance des présentes CGU et les accepter.L'utilisation de l'Application vaut acceptation sans réserve des CGU.</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">En cas de désaccord avec tout ou partiedes CGU, vous devez immédiatement vous abstenir d'utiliser l'Application. Offzonese réserve le droit de modifier à tout moment et sans préavis les termes desCGU. Les modifications entrent en vigueur immédiatement après la publicationdes conditions modifiées sur l'Application.</span></p>
<p class="p3"><span class="s1"></span><br></p>
<p class="p4"><span class="s1">Définitions</span></p>
<p class="p3"><span class="s1"></span><br></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">Application : désignel'application mobile éditée et exploitée par OFFZONE.</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">CGU : désigne les présentes conditionsgénérales d'utilisation de l'Application.</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">Contenu Utilisateur : désigneles données transmises par l'Utilisateur dans les différentes rubriques del'Application.</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">Données de navigation : désigneles informations liées à la connexion de votre terminal à l’Application. Noussommes susceptibles d’utiliser ces données de navigation à des finsstatistiques.</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">Données personnelles : désigneles informations liées aux Utilisateurs.</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">Partenaires : désignel’ensemble des sites e-commerce ou sociétés informatiques avec lesquels nousavons un contrat de partenariat direct ou indirect.</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">Services : désigne l’ensemble des services,payants ou gratuits, accessibles aux Utilisateurs.</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">Utilisateur(s) : désigneune (ou l’ensemble des) personne(s) inscrite sur l'Application.</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">InSkin : désigne le produit ou la marque de lasociété OFFZONE qui édite l'Application.</span></p>
<p class="p3"><span class="s1"></span><br></p>
<p class="p4"><span class="s1">Accès aux services</span></p>
<p class="p3"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">Les services proposés par InSkin via l'Applicationcomprennent, entre autres :</span></p>
<p class="p1"><span class="s1">-         La consultation des informations sur les produitscosmétiques par le biais du scanner de codes-barres. Les services proposés par InSkin via l'Applicationcomprennent, entre autres :</span></p>
</body>
</html>

`