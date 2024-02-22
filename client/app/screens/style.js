import { StyleSheet } from "react-native";

const style=StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white',
      },
      textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
      },
      smallIcon: {
        marginRight: 10,
        fontSize: 24,
      },
      logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      logo: {
        height: 260,
        width: 260,
        marginTop: 30,
      },
      text_footer: {
        color: '#05375a',
        fontSize: 18,
      },
      action: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1, // Pour un contour visible autour du TextInput
        borderColor: '#ccc', // Couleur du contour
        borderRadius: 5, // Pour des coins arrondis
        paddingHorizontal: 10, // Pour un espacement horizontal à l'intérieur du conteneur
        marginBottom: 10, // Pour un espacement en bas du conteneur
      },
      textInput: {
        flex: 1, // Pour que le TextInput prenne tout l'espace restant
        height: 40, // Hauteur du TextInput
        marginLeft: 5, // Espacement entre l'icône et le TextInput
      },
      loginContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,
      },
      header: {
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
      },
      text_header: {
        color: '#420475',
        fontWeight: 'bold',
        fontSize: 30,
      },
      button: {
        alignItems: 'center',
        marginTop: -20,
        alignItems: 'center',
        textAlign: 'center',
        margin: 20,
      },
      inBut: {
        width: '70%',
        backgroundColor: '#420475',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 50,
      },
      inBut2: {
        backgroundColor: '#420475',
        height: 65,
        width: 65,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
      },
      bottomButton: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      smallIcon2: {
        fontSize: 40,
        // marginRight: 10,
      },
      bottomText: {
        color: 'black',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 5,
      },
      label: {
        marginBottom: 10,
        marginRight: 30, // Espacement entre le label et le champ de saisie
        fontSize: 16, // Taille de police du label
        fontWeight: 'bold', // Poids de la police du label
      },
})
export default style;