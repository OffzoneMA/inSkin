import React, { useContext } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput
} from "react-native";
import style from './style';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AuthContext from "../contexts/auth";
import jwt_decode from "jwt-decode";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { APP_BUTTON_DEFAULT_HIGHT, APP_BUTTON_DEFAULT_MIN_WIDTH, FountsEnum } from '../constants/constants'

// Components
import Page from "../components/Page";
import Heading from "../components/Heading";
import Paragraph from "../components/Paragraph";
import Button from "../components/Button";
import TextLink from "../components/TextLink";
import AppTextInput from '../components/AppTextInput';
import AppText from '../components/AppText'
import { colors, images } from '../constants';
// API
import authApi from "../api/auth";
import useApi from "../hooks/useApi";
import authStorage from "../utilities/authStorage";

//import { useToast } from "react-native-toast-notifications";

const validationSchema = Yup.object({
  email: Yup.string().required("Email est requis").email("Email invalide").label("Email"),
  password: Yup.string().required("Mot de passe requis").min(4, "Le mot de passe doit contenir au moins 4 caractères").label("Password"),
});
 
export default function LoginScreen({ navigation }) {
  const loginApi = useApi(authApi.login);
  const authContext = useContext(AuthContext);
  //const toast = useToast();

  const loginHandler = async ({ email, password }) => {
    const result = await loginApi.request(email, password);
    console.log("j ai pas compris",result)
    if (!result.ok) {
      //toast.show(result.data, {type: "danger"});
      console.log("n est pas comris")
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

  return (
    <>
      <Page>
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
        <View >
             <Text style={{fontSize: 25, fontWeight: 'bold'}}>Bienvenue de nouveau,</Text> 
             <Text style={{ fontSize: 18, marginVertical: 10}}>Connectez-vous pour continuer</Text>
            
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
                <ScrollView>
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
                labelTitle="Mot de passe"
                placeholderText="Confirmez votre mot de passe"
                isForPassword={true}
                value={values.password}
                onChangeText={handleChange("password")}
                errorMessage={errors.password}
                onBlur={() => setFieldTouched("password")}
                errorVisible={touched.password && errors.password}
              />
                  <TextLink
                    onPress={() => navigation.navigate("Forgotpassword")}
                    style={{ alignSelf: "flex-end", marginTop: 10 }}
                  >
                   Mot de passe oublié ?

                  </TextLink>
                </ScrollView>

               
                <Button
  loading={loginApi.loading}
  onPress={handleSubmit}
  style={{
    width: '100%',
    height: APP_BUTTON_DEFAULT_HIGHT,
    minWidth: APP_BUTTON_DEFAULT_MIN_WIDTH,
    marginTop: 20,
    opacity: values.email && values.password ? 1 : 0.5,
    backgroundColor: colors.pink,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#EA6479', 
    color: colors.white,
    fontSize: 14,
  }}
  disabled={!values.email || !values.password || Object.keys(errors).length !== 0}
>
Se connecter
</Button>
              </>
            )}
          </Formik>

          <View
            style={{ marginTop: 20, marginBottom: 10, flexDirection: "row" }}
          >
            <Paragraph style={{ marginRight: 10, color: 'black' }}>Vous n'avez pas de compte ?</Paragraph>

            <TextLink onPress={() => navigation.navigate("Register1")}>
            S'inscrire
            </TextLink>
          </View>
        </KeyboardAwareScrollView>
      </Page>
    </>
  );
}

const styles = StyleSheet.create({});
