import React, { useCallback, useContext,useState,useEffect  } from "react";
import { StyleSheet,Modal,TouchableOpacity , View, ScrollView, TextInput,Text,Image } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AuthContext from "../contexts/auth";
import jwt_decode from "jwt-decode";
import { FontAwesome } from '@expo/vector-icons';
// Components
import Page from "../components/Page";
import Heading from "../components/Heading";
import Paragraph from "../components/Paragraph";
import Button from "../components/Button";
import CheckBox from "../components/CheckBox";
import TextLink from "../components/TextLink";
import Fontisto from 'react-native-vector-icons/Fontisto';
import authApi from "../api/auth";
import useApi from "../hooks/useApi";
import authStorage from "../utilities/authStorage";
import style from './style';
import AppTextInput from '../components/AppTextInput';
import AppText from '../components/AppText'
import { colors, images } from '../constants';
import { LocalesMessages } from '../constants/locales'
const validationSchema = Yup.object({
  firstName: Yup.string().required().label("First name"),
  lastName: Yup.string().label("Last Name"),
  lastName: Yup.string().label("Last Name"),
  email: Yup.string().required("Email est requis").email("Email invalide").label("Email"),
  password: Yup.string().required("Mot de passe requis").min(4, "Le mot de passe doit contenir au moins 4 caractères").label("Password"),
  passwordConfirmation: Yup.string()
    .required("Password needs to be confirmed")
    .oneOf([Yup.ref("password"), null], "Les mots de passe ne correspondent pas"),
});
export default function RegisterScreen({ route, navigation }) {
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const registerApi = useApi(authApi.register);
  const handleGoogleLogin=useApi(authApi.handleGoogleLogin);
  const [music, setMusic] = useState(false); 
  const [acceptedConditions, setAcceptedConditions] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const authContext = useContext(AuthContext);
  const [currentError,setCurrentError] = React.useState('');
  const checkFormFilled = (values) => {
    const { firstName, lastName, email, password, passwordConfirmation } = values;
    return !!firstName && !!lastName && !!email && !!password && !!passwordConfirmation;
  };
  const [isChecked, setIsChecked] = useState(false);
  //const toast = useToast();
  const handleCheck = (checked) => {
    console.log("Checked:", checked);
    setIsChecked(checked);

  };
  

  const buttonPressed = () => {
    bottomSheetRef.current?.present();
  };
  const renderBackdrop = useCallback((props) => {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    );
  }, []);
  
  const [currentSize, setCurrentSize] = useState("38");

  const goToCart = () => {
    console.log("goToCart");
    bottomSheetRef.current?.dismiss();
    // TODO: navigation.navigate('Cart');
  };

  const continuePurchase = () => {
    console.log("continue");
    bottomSheetRef.current?.dismiss();
  };
  const checkFormValid = async ({ firstName,lastName, email, password, passwordConfirmation }) => {
    try {
      // Vérifier la validité du formulaire
      const isValid = await validationSchema.isValid({
        firstName,
        lastName,
        email,
        password,
        passwordConfirmation
      });
      // Mettre à jour l'état isFormValid
      setIsFormValid(isValid);
    } catch (error) {
      console.error("Validation error:", error);
    }
  };
  

  

  // Reste du code inchangé

  const registerHandler = async ({
    firstName,
    lastName,
    email,
    password,
  }) => {
    console.log("I'm here")
    var readerType;
    var readerGoals;
    var readerGenres;
    try {
      readerType = route.params.readerType;
      readerGoals = route.params.readerGoals;
      readerGenres = route.params.readerGenres;
    } catch (e) {
      readerType = null;
      readerGoals = [];
      readerGenres = [];
    }

    const result = await registerApi.request(
      firstName.trim(),
      lastName.trim(),
      email,
      password,
      readerType,
      readerGoals,
      readerGenres
    );
   console.log(result)

    if (!result.ok) {
      setShowTerms(false);
      if (result.status === 400) {
        console.log("Un utilisateur est déjà enregistré avec cet e-mail !");
        setCurrentError("Un utilisateur est déjà enregistré avec cet e-mail !")
      } else {
        console.log("Une erreur est survenue !");
        setCurrentError("Une erreur est survenue !")
      }

      return;
    }
     
    //toast.show(result.data.message, {type: "success"});

    setTimeout(() => {
      AsyncStorage.setItem("hasOnboarded", "true");
      var { user } = jwt_decode(result.headers["bearer-token"]);
      authContext.setUser(user);
      authStorage.storeToken(result.headers["bearer-token"]);

      navigation.reset({
        index: 0,
        routes: [{ name: "Tab" }],
      });
    }, 300);
  };
 const handleSubmit1 = async() => {
   setCurrentError("")
    console.log("sgsgsgsg")
    setShowTerms(true);
  };
  const handleSubmitwhithgoogle = async() => {
    console.log("authentification whith google")
    const result = await handleGoogleLogin.request();
  };
  const handleCloseModal = () => {
    setShowTerms(false);
  };
  
  return (
    <>
      <Page>
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
       
          <View >
             <Text style={{fontSize: 30, fontWeight: 'bold'}}>Créer un compte</Text> 
             <Text style={{ fontSize: 18, marginVertical: 10}}>S'inscrire</Text>
            
          </View>
          {currentError ? (
                  <Text style={{ color: 'red', marginTop: 5 }}>{currentError}</Text>
                ) : null}
          <Formik
            initialValues={{
              firstName: "",
              lastName:"",
              email: "",
              password: "",
              passwordConfirmation: "",
            }}
            onSubmit={registerHandler}
            validationSchema={validationSchema}
            validateOnChange={true}
          >
            {({
              handleChange,
              handleSubmit,
              errors,
              setFieldTouched,
              touched,
              values,
            }) => (
              <>
                <ScrollView>
                <AppTextInput
                    placeholderText="saisir votre Prénom "
                    labelTitle="Prénom "
                    value={values.firstName}
                    errorVisible={touched.firstName && errors.firstName}
                    errorMessage={errors.firstName}
                    onChangeText={handleChange("firstName")}
                    onBlur={() => setFieldTouched("firstName")}
                  />
                   <AppTextInput
                    placeholderText="saisir votre Nom  "
                    labelTitle="Nom "
                    value={values.lastName}
                    errorVisible={touched.lastName && errors.lastName}
                    errorMessage={errors.lastName}
                    onChangeText={handleChange("lastName")}
                    onBlur={() => setFieldTouched("lastName")}
                  />
                   
                   <AppTextInput
                    placeholderText="Saisir votre adresse e-mail"
                    labelTitle="Adresse e-mail"
                    leftImageSource={images.email}
                    value={values.email}
                    errorVisible={touched.email && errors.email}
                    errorMessage={errors.email}
                    onChangeText={handleChange("email")}
                    onBlur={() => setFieldTouched("email")}
                  />
                  <AppTextInput
                  labelTitle={LocalesMessages.yourPassword}
                  placeholderText="saisir votre mot de passe"  
                  isForPassword={true}
                  value={values.password}
                  onChangeText={handleChange("password")}
                  errorMessage={errors.password}
                  onBlur={() => setFieldTouched("password")}
                  errorVisible={touched.password && errors.password}
                />
                <AppTextInput
                  labelTitle={LocalesMessages.confirmPassword}
                  placeholderText="confirmer votre mot de passe"
                  isForPassword={true}
                  value={values.passwordConfirmation}
                  onChangeText={handleChange("passwordConfirmation")}
                  errorMessage={errors.password}
                  onBlur={() => setFieldTouched("passwordConfirmation")}
                  errorVisible={touched.passwordConfirmation && errors.passwordConfirmation}
                />
                
        {touched.passwordConfirmation && values.password !== values.passwordConfirmation && (
            <Text style={styles.errorText}>Les mots de passe ne correspondent pas!</Text>
        )}
          
                  <Button
                   onPress={handleSubmit1}
                   style={{
                    marginTop: 20,
                    opacity: values.email && values.password && values.firstName && values.lastName && values.passwordConfirmation? 1 : 0.5,
                    backgroundColor: '#EA6479', // couleur de fond du bouton
                    color: 'white', // couleur du texte du bouton
                    borderColor: '#EA6479', // couleur de la bordure du bouton
                    borderWidth: 1, // épaisseur de la bordure
                    borderRadius: 5, // bordure arrondie
                  }}
                  disabled={!values.email || !values.password || Object.keys(errors).length !== 0}
                   
                   
                    >
                       <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'white', marginRight: 5 }}>Continuer</Text>
                             <FontAwesome name="long-arrow-right" size={18} color="white" />
                              </View>
                         </Button>
                         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                        <Text style={{ paddingHorizontal: 5 }}>ou</Text>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'black' }} />
                        </View>
                        <Button
                   onPress={handleSubmitwhithgoogle}
                   style={{
                    marginTop: 20,
                    backgroundColor: '#F4F4F4', // Fond gris clair pour le bouton Google
                    borderColor: '#F4F4F4', // Bordure gris clair
                    color: 'black', 
                    borderWidth: 1, 
                    borderRadius: 5, 
                  }}
                 
                   
                   
                    >
                       <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                       <Image
                            source={require('../../img/google_icone.png')} 
                            style={{ width: 24, height: 24, marginRight: 5 }} 
    />
                       <Text style={{ color: 'black', marginLeft: 5 }}>S'inscrire avec Google</Text>
                            
                              </View>
                         </Button>
                         
                </ScrollView>
                
                <Modal
  visible={showTerms}
  transparent={true}
  animationType="slide" // Utilisez l'animation slide pour un effet de glissement
>
  <View style={{ flex: 1, justifyContent: 'flex-end' }}>
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={handleCloseModal}
    />
    <View style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
      <TouchableOpacity
        onPress={handleCloseModal}
        style={{ position: 'absolute', top: 10, right: 10 }}
      >
        <FontAwesome name="close" size={18} color="gray" />
      </TouchableOpacity>
      <Text style={{ marginBottom: 10, color: 'black', fontSize: 20, fontWeight: 'bold' }}>Conditions Générales d'Utilisation</Text>
      <View style={{ borderBottomWidth: 1, borderBottomColor: 'gray', marginBottom: 10 }} />
      <Text style={{ marginRight: 10, color: 'black', fontWeight: 'bold' }} >
      Veuillez lire et accepter les conditions ci-dessous. Merci.
</Text>

      <Text>Conformément à la loi 09-08, vous disposez d'un droit d'accès, de rectification et d'opposition au traitement de vos données personnelles. Ce traitement a été autorisé par la CNDP sous le numéro (en cours).</Text>
      <CheckBox
        title="J'accepte les Conditions d'Utilisation et la Politique de Confidentialité de InSkin."
        onPress={() => setMusic(!music)}
        isChecked={music}
      />
      <CheckBox
        title="Mémorisez mon nom d'utilisateur."
      />
      <Button
        loading={registerApi.loading}
        onPress={handleSubmit}
        title="S'inscrire."
        // style={[styles.button, music ? styles.buttonChecked : styles.buttonUnchecked]}
        style={{
          marginTop: 20,
          opacity: music ? 1 : 0.5,
          backgroundColor: '#EA6479', // couleur de fond du bouton
          color: 'white', // couleur du texte du bouton
          borderColor: '#EA6479', // couleur de la bordure du bouton
          borderWidth: 1, // épaisseur de la bordure
          borderRadius: 5, // bordure arrondie
        }}
        textStyle={styles.buttonText}
        disabled={!music}
      >
        S'inscrire
      </Button>
    </View>
  </View>
</Modal>


        
              </>
            )}
          </Formik>

          <View
            style={{ marginTop: 20, marginBottom: 10, flexDirection: "row" }}
          >
            <Paragraph style={{ marginRight: 10, color: 'black' }}>Vous avez déjà un compte ? </Paragraph>
            <TextLink onPress={() => navigation.navigate("Login")}>
            Connectez-vous.
            </TextLink>
          </View>
          
        </KeyboardAwareScrollView>
      </Page>
    </>
    
  );
}

const styles = StyleSheet.create({
  image: {
    width: 70,
    height: 70,
    marginTop: -15,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
 
  errorText: {
    color: 'red', // Couleur du texte d'erreur
    marginTop: 5, // Espacement par rapport au champ d'entrée
  },
});
const styless = StyleSheet.create({
  safearea: {flex: 1, backgroundColor: '#020514'},
  container: {
    marginTop: 30,
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  checkbox: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
});