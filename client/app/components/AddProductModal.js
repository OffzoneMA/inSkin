// CustomModal.js

import { React, useContext}from 'react';
import { View, Text, Modal } from 'react-native';
import Button from './Button'; // Import Button component if it's in a separate file

const AddProductModal = ({ isVisible, onClose, onAddProduct }) => {

    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
        >
        <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 10, backgroundColor: "white", borderRadius: 10, height: 100}}>
            <Text>This product doesn't exist!</Text>
            <Text>Would you like to add it?</Text>
            <View style={{flexDirection: "row"}}>
            <Button style={{flex: 1, marginRight: 2}} title="Yes" 
                onPress={() => {
                    onClose();
                    onAddProduct();
                }}>
                Yes
            </Button>
            <Button style={{flex: 1, marginLeft: 2}} title="No" onPress={onClose}>
                No
            </Button>
            </View>
        </View>
        </Modal>
    );
};

export default AddProductModal;
