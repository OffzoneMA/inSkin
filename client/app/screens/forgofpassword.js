import React, { useContext } from "react";
import { StyleSheet, View, ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import style from './style';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AuthContext from "../contexts/auth";
import jwt_decode from "jwt-decode";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Components
import Page from "../components/Page";
import Heading from "../components/Heading";
import Paragraph from "../components/Paragraph";
import Button from "../components/Button";
import TextLink from "../components/TextLink";

// API
import authApi from "../api/auth";
import useApi from "../hooks/useApi";
import authStorage from "../utilities/authStorage";

//import { useToast } from "react-native-toast-notifications";

const validationSchema = Yup.object({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

export default function Forgotpassword({ navigation }) {
    const loginApi = useApi(authApi.login);
    const authContext = useContext(AuthContext);
    //const toast = useToast();
  
    const loginHandler = async ({ email }) => {
      const result = await loginApi.request(email);
      console.log("j ai pas compris",result)
      if (!result.ok) {
        console.log("n est pas comris")
        return;
      }
  
     
  
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
    const handleSubmit1 = async (values) => {
      try {
        // Vérifier si l'email existe
        const result = await authApi.checkEmailExists(values.email);
        if (!result.ok) {
          // Si l'email n'existe pas, afficher un message d'erreur
          console.log("Email does not exist");
          // Afficher un message d'erreur à l'utilisateur
          return;
        }
    
        // Si l'email existe, envoyer une demande de réinitialisation du mot de passe
        const resetPasswordResult = await authApi.resetPasswordRequest(values.email);
        if (!resetPasswordResult.ok) {
          // En cas d'erreur lors de l'envoi de la demande, afficher un message d'erreur
          console.log("Error sending password reset request");
          // Afficher un message d'erreur à l'utilisateur
          return;
        }
    
        // Si la demande est réussie, rediriger l'utilisateur vers une page de confirmation
        console.log("Password reset request sent successfully");
        navigation.navigate("ResetPasswordConfirmation"); // Rediriger vers la page de confirmation de la réinitialisation du mot de passe
      } catch (error) {
        console.error("Error handling password reset request:", error);
        // Afficher un message d'erreur générique à l'utilisateur
      }
    };
    
    
    return (
    <>
    <Page>
    
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
        
      <View  style={{ marginLeft: 10 ,flexDirection: 'column', alignItems: 'flex-start'}}>
      <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20, // Pour rendre le View en forme de cercle
            backgroundColor: '#F4F4F4', // Fond gris clair du cercle
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 5, // Espacement à gauche
          }}
        >
          <FontAwesome name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
           <Text style={{fontSize: 25, fontWeight: 'bold', marginTop: 60}}>Forgot Password?</Text> 
            <Text style={{ fontSize: 18, marginVertical: 10  }}>Please provide your email address below to retrieve a new password</Text>
        </View>
        <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={loginHandler}
            validationSchema={validationSchema}
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
                <ScrollView style={{fontSize: 25, fontWeight: 'bold', marginTop: 40}}>
                  <Text style={style.label}>Email adress:</Text>
                   <View style={[style.action, touched.email && errors.email && styles.inputError]}>
                    <Fontisto
                      name="email"
                      color="#420475"
                      size={24}
                     style={{marginLeft: 0, paddingRight: 5}}
            />
                  <TextInput
                 style={style.textInput}
                 placeholder="Enter your email address"
                    autoCompleteType="email"
                    keyboardType="email-address"
                    returnKeyType="next"
                    textContentType="emailAddress"
                    autoCapitalize="none"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    errorMessage={errors.email}
                    onBlur={() => setFieldTouched("email")}
                    errorVisible={touched.email}
                  />
                  {touched.email && errors.email && (
                 <FontAwesome name="exclamation-circle" color="red" size={24} style={{ marginRight: 5 }} />
                    )}
                  </View>
                  </ScrollView>
                  <Button
  onPress={() => handleSubmit1(values)}
  style={{
    marginTop: 20,
    opacity: values.email ? 1 : 0.5,
    backgroundColor: '#EA6479', // couleur de fond du bouton
    color: 'white', // couleur du texte du bouton
    borderColor: '#EA6479', // couleur de la bordure du bouton
    borderWidth: 1, // épaisseur de la bordure
    borderRadius: 5, // bordure arrondie
  }}
 
>
  Send request
</Button>

                  </>
                  )}
                  
          </Formik>
        </KeyboardAwareScrollView>
    
        
        </Page>
        </>
    )
}
