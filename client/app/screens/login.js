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
 
export default function LoginScreen({ navigation }) {
  const loginApi = useApi(authApi.login);
  const authContext = useContext(AuthContext);
  //const toast = useToast();

  const loginHandler = async ({ email, password }) => {
    const result = await loginApi.request(email, password);
    console.log("n est pas comris",result)
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
             <Text style={{fontSize: 30, fontWeight: 'bold'}}>Welcome Back</Text> 
             <Text style={{ fontSize: 18, marginVertical: 10}}>Sign In to continue</Text>
            
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
                  {/* <Label style={{marginBottom: 10}}>Email</Label> */}
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
                  {/* <Label style={{marginBottom: 10}}>Password</Label> */}
                  <Text style={style.label}>Password:</Text>
                  <View style={[style.action, touched.password && errors.password && styles.inputError]}>
                  <TextInput
                   style={style.textInput}
                    placeholder="Password"
                    autoCompleteType="password"
                    keyboardType="default"
                    returnKeyType="next"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    value={values.password}
                    onChangeText={handleChange("password")}
                    errorMessage={errors.password}
                    onBlur={() => setFieldTouched("password")}
                    errorVisible={touched.password}
                  />
                   {touched.password && errors.password && (
                 <FontAwesome name="exclamation-circle" color="red" size={24} style={{ marginRight: 5 }} />
                    )}
                  </View>
                  <TextLink
                    onPress={() => console.log("Forgot Password")}
                    style={{ alignSelf: "flex-end", marginTop: 10 }}
                  >
                    Forgot Password?
                  </TextLink>
                </ScrollView>

               
                <Button
  loading={loginApi.loading}
  onPress={handleSubmit}
  style={{
    marginTop: 20,
    opacity: values.email && values.password ? 1 : 0.5,
    backgroundColor: '#EA6479', // couleur de fond du bouton
    color: 'white', // couleur du texte du bouton
    borderColor: '#EA6479', // couleur de la bordure du bouton
    borderWidth: 1, // épaisseur de la bordure
    borderRadius: 5, // bordure arrondie
  }}
  disabled={!values.email || !values.password || Object.keys(errors).length !== 0}
>
  Sign In
</Button>



              </>
            )}
          </Formik>

          <View
            style={{ marginTop: 20, marginBottom: 10, flexDirection: "row" }}
          >
            <Paragraph style={{ marginRight: 10, color: 'black' }}>Don’t have an account ?</Paragraph>

            <TextLink onPress={() => navigation.navigate("Register1")}>
            Sign Up
            </TextLink>
          </View>
        </KeyboardAwareScrollView>
      </Page>
    </>
  );
}

const styles = StyleSheet.create({});
