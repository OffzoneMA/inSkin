/**
 * add keys to use multi language in app
 * add key in localMessages and values in respective languages
 * */
export const LocalesMessages = Object.freeze({
  greeting: 'greeting',
  editProfile: 'modifier le profil',
  followers: 'abonnés',
  posts: 'publications',
  oops: 'Oups',
  youHaveToCommentOrRateProduct: 'Vous devez commenter ou noter le produit',
  scanProduct: 'Scanner le produit',
  scanAddProduct: 'Scanner et ajouter un produit',
  profile: 'Profil',
  personalDetail: 'Détails personnels',
  personalDetailSmall: 'Détails personnels ',
  personalDetailDesc: 'Voir et gérer vos informations personnelles',
  socialMediaProfile: 'Profil des réseaux sociaux',
  socialMediaProfileSmall: 'Profil des réseaux sociaux ',
  socialMediaProfileDesc: 'Créez des Lien vers vos réseaux sociaux.',
  notifications: 'Notifications',
  notificationsDesc: 'Contrôlez vos paramètres de notification',
  settings: 'Paramètres',
  settingsDesc: 'Gérez les paramètres de l\'application',
  legal: 'Légal',
  legalDesc: 'Conditions générales',
  logout: 'Déconnexion',
  editConfirmYourPersonalInformation: 'Modifier et confirmer vos informations personnelles',
  userName: 'Nom d\'utilisateur',
  firstName: 'Prénom',
  lastName: 'Nom ',
  emailAddress: 'Adresse email',
  phoneNumber: 'Numéro de téléphone',
  confirm: 'Confirmer',
  legalInformation: 'Informations légales',
  termsOfUse: "Conditions d'utilisation",
  legalNotice: 'Mentions légales',
  privacyPolicy: 'Politique de confidentialité',
  cookiePolicy: 'Politique des cookies',
  socialMediaProfiles: 'Profils sur les réseaux sociaux',
  TIkTok: 'TikTok',
  enterYourProfileLink: 'Entrez le lien de votre profil',
  Instagram: 'Instagram',
  areYouSureYouWantLeaveTheApp: 'Êtes-vous sûr de vouloir quitter l’application ?',
  cancel: 'Annuler',
  changePassword: 'Changer le mot de passe',
  support: 'Support',
  rateTheAppOnAppStore: "Évaluer l'application sur l'App Store",
  termsOfService: 'Conditions de service',
  deactivateAccount: 'Désactiver le compte',
  areYouSureYouWantDeleteYourAccount: 'Êtes-vous sûr de vouloir supprimer votre compte ?',
  yourPassword: 'Votre mot de passe',
  enterYourCurrentPassword: 'Entrez votre mot de passe actuel',
  continue: 'Continuer',
  yourNewPassword: 'Votre nouveau mot de passe',
  enterYourNewPassword: 'Entrez votre nouveau mot de passe',
  confirmPassword: 'Confirmer le mot de passe',
  confirmYourNewPassword: 'Confirmez votre nouveau mot de passe',
  yourPasswordHasBeenSuccessfullyChanged: 'Votre mot de passe a été changé avec succès',
  OK: 'OK',
  youHaveNoMessages: 'Vous n’avez aucun message',
  helloHowCanWeHelpYou: 'Bonjour, comment pouvons-nous vous aider ?',
  goodAfternoonDonKnowHowContactTheDriverTheLastTripThink: "Bonjour, vous ne savez pas comment contacter le conducteur du dernier trajet ? Pensez à…",
  Push: 'Push',
  Enabled: 'Activé',
  Disabled: 'Désactivé',
  SMS: 'SMS',
  Email: 'Email',
  whenPeopleFollowAddProduct: "Quand quelqu'un suit ou ajoute un produit",
  whenNewProductAddedTheList: "Quand un nouveau produit est ajouté à la liste",
  whenProductNotedAsBestProductStars: 'Quand un produit est noté comme le meilleur avec des étoiles',
  pushNotifications: 'Notifications push',
  accountActivity: 'Activité du compte',
  countraMix: 'Countra Mix',
  addAComment: 'Ajouter un commentaire',
  addToCategory: 'Ajouter à la catégorie',
  createCategory: 'Créer une catégorie',
  add: 'Ajouter',
  favorites: 'Favoris',
  youDontHaveAnyFavorites: 'Vous n’avez aucun favori',
  filter: 'Filtrer',
  addCategory: 'Ajouter une catégorie',
  enterTitleOfYourCategory: 'Entrez le titre de votre catégorie',
  forMeOnly: 'Pour moi seulement',
  action: 'Action',
  editCategoryInfo: 'Modifier les informations de la catégorie',
  deleteCategory: 'Supprimer la catégorie',
  areYouSureDeleteCategory: 'Êtes-vous sûr de vouloir supprimer la catégorie ?',
  shareProduct: 'Partager le produit',
  deleteProduct: 'Supprimer le produit',
  areYouSureDeleteProduct: 'Êtes-vous sûr de vouloir supprimer le produit ?',
  category: 'Catégorie',
  apply: 'Appliquer',
  clearFilter: 'Effacer le filtre',
  description: 'Description',
  comments: 'Commentaires',
  mostRecent: 'Les plus récents',
  yourAssessment: 'Votre évaluation',
  welcomeToInSkin: 'Bienvenue sur InSkin',
  followPeopleToStartSeeingThe: 'Suivez des personnes pour commencer à voir…',
  productsAndPostsTheyShare: 'les produits et publications qu’ils partagent',
  chanel: 'Chanel',
  goToPost: 'Aller à la publication'
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
