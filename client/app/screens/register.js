import React, { useContext,useState,useEffect  } from "react";
import { StyleSheet,Modal,TouchableOpacity , View, ScrollView, TextInput,Text } from "react-native";
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
const validationSchema = Yup.object({
  firstName: Yup.string().required().label("First name"),
  //lastName: Yup.string().label("Last Name"),
  lastName: Yup.string().label("Last Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
  passwordConfirmation: Yup.string()
    .required("Password needs to be confirmed")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export default function RegisterScreen({ route, navigation }) {
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const registerApi = useApi(authApi.register);
  const [music, setMusic] = useState(false); 
  const [acceptedConditions, setAcceptedConditions] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const authContext = useContext(AuthContext);
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

    if (!result.ok) {
      //toast.show(result.data, {type: "danger"});
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
    console.log("sgsgsgsg")
    

    setShowTerms(true);
  };
  const handleCloseModal = () => {
    setShowTerms(false);
  };
  
  return (
    <>
      <Page>
        <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
       
          <View >
             <Text style={{fontSize: 40, fontWeight: 'bold'}}>Create Account</Text> 
             <Text style={{ fontSize: 18, marginVertical: 10}}>Sign Up</Text>
            
          </View>

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
                <Text style={style.label}>Username:</Text>
                    <View style={[style.action, touched.firstName && errors.firstName && styles.inputError]}>
                      <TextInput
                      style={style.textInput}
                        placeholder="Enter your username"
                        autoCompleteType="name"
                        keyboardType="default"
                        returnKeyType="next"
                        textContentType="givenName"
                        autoCapitalize="none"
                        value={values.firstName}
                        onChangeText={handleChange("firstName")}
                        errorMessage={errors.firstName}
                        onBlur={() => setFieldTouched("firstName")}
                        errorVisible={touched.firstName}
                      />
                      {touched.firstName && errors.firstName && (
                 <FontAwesome name="exclamation-circle" color="red" size={24} style={{ marginRight: 5 }} />
                    )}
                    </View>
                    {touched.firstName  && errors.firstName && (
                      <Text style={styles.errorText}>{errors.firstName}</Text>
                              )}
                              <Text style={style.label}>lastName:</Text>
                    <View style={[style.action, touched.lastName && errors.lastName && styles.inputError]}>
                      <TextInput
                      style={style.textInput}
                        placeholder="Enter your lastName"
                        autoCompleteType="name"
                        keyboardType="default"
                        returnKeyType="next"
                        textContentType="givenName"
                        autoCapitalize="none"
                        value={values.lastName}
                        onChangeText={handleChange("lastName")}
                        errorMessage={errors.lastName}
                        onBlur={() => setFieldTouched("lastName")}
                        errorVisible={touched.lastName}
                      />
                      {touched.lastName && errors.lastName && (
                 <FontAwesome name="exclamation-circle" color="red" size={24} style={{ marginRight: 5 }} />
                    )}
                    </View>
                    {touched.lastName  && errors.lastName && (
                      <Text style={styles.errorText}>{errors.lastName}</Text>
                              )}
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
                  {touched.email && errors.email && (
                      <Text style={styles.errorText}>Please verify the entered email address and try again!</Text>)}
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
                  {touched.firstName  && errors.firstName && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                              )}
                  <Text style={style.label}>Confirm Password:</Text>
                 <View style={[style.action, touched.passwordConfirmation && errors.passwordConfirmation && styles.inputError]}>
                  <TextInput
                   style={style.textInput}
                    placeholder="Confirm Password"
                    autoCompleteType="password"
                    keyboardType="default"
                    returnKeyType="done"
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                    value={values.passwordConfirmation}
                    onChangeText={handleChange("passwordConfirmation")}
                    errorMessage={errors.passwordConfirmation}
                    onBlur={() => setFieldTouched("passwordConfirmation")}
                    errorVisible={touched.passwordConfirmation}
                  />
                   {touched.passwordConfirmation && errors.passwordConfirmation && (
                 <FontAwesome name="exclamation-circle" color="red" size={24} style={{ marginRight: 5 }} />
                    )}
                  </View>
                  {touched.passwordConfirmation && errors.passwordConfirmation && (
            <Text style={styles.errorText}>{errors.passwordConfirmation}</Text>
        )}
        {touched.passwordConfirmation && values.password !== values.passwordConfirmation && (
            <Text style={styles.errorText}>Please verify the entered information and try again!</Text>
        )}
          
                  <Button
                   onPress={handleSubmit1}
                   style={[styles.button, !isFormValid ? styles.buttonChecked : styles.buttonUnchecked]}
                   disabled={isFormValid}
                   
                    >
                       <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'white', marginRight: 5 }}>Continue</Text>
                             <FontAwesome name="long-arrow-right" size={18} color="white" />
                              </View>
                         </Button>
          
                </ScrollView>
                
                <Modal
            visible={showTerms}
            transparent={true}
            animationType="fade"
          >
            <TouchableOpacity
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              onPress={handleCloseModal}
            >
              <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                <TouchableOpacity
                  onPress={handleCloseModal}
                  style={{ position: 'absolute', top: 10, right: 10 }}
                >
                  <FontAwesome name="close" size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ marginBottom: 10 }}>Terms and Conditions</Text>
               <Text> Please read and accept the conditions below. Thank you.</Text>
               <Text>In accordance with the law 09-08, you have the right to access, rectify, and object to the processing of your personal data.This processing has been authorized by the CNDP under number (in progress).</Text>
               <CheckBox
                     title="I accept the Terms of Service and the Privacy Policy of InSkin."
                     onPress={() => setMusic(!music)} 
                     isChecked={music} />


<Button
  loading={registerApi.loading}
  onPress={handleSubmit}
  title="Sign up"
  style={[styles.button, music ? styles.buttonChecked : styles.buttonUnchecked]}
  textStyle={styles.buttonText}
  disabled={music}
>
  Sign up
</Button>


                </View>
          </TouchableOpacity> 
          
                </Modal>
        
              </>
            )}
          </Formik>

          <View
            style={{ marginTop: 20, marginBottom: 10, flexDirection: "row" }}
          >
            <Paragraph style={{ marginRight: 10 }}>Have an account?</Paragraph>
            <TextLink onPress={() => navigation.navigate("Login")}>
              Login
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
  buttonChecked: {
    backgroundColor: '#EA6479', // Couleur lorsque le CheckBox est coché
  },
  buttonUnchecked: {
    backgroundColor: '#ECCC9', // Couleur lorsque le CheckBox n'est pas coché
  },
  inputError: {
    borderColor: 'red', // Couleur de la bordure en cas d'erreur
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