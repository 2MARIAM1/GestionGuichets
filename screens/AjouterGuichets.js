import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { saveToAsyncStorage, saveToFile, loadFromAsyncStorage } from '../utils/utils';
import * as ImagePicker from 'expo-image-picker';
import { Icon } from 'react-native-elements';



const AjouterGuichet = ({ navigation, route }) => {
    const { onGuichetAdded } = route.params || {};

    const [nom, setNom] = useState('');
    const [role, setRole] = useState('Banque');
    const [statut, setStatut] = useState('Actif');
    const [photo, setPhoto] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync(
            {
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            },
        );
        if (!result.canceled) {
            setPhoto(result.assets[0].uri); // Save the selected image URI
        }


    };
    const handleSubmit = async () => {
        if (!nom.trim() || !role.trim() || !statut.trim()) {
            Alert.alert("Validation", "All fields are required.");
            return; // Exit function if validation fails
        }


        const newGuichet = {
            id: Date.now(), // Unique ID
            nom,
            role,
            statut,
            photo,
            favori: false,

        };

        // Load existing guichets from AsyncStorage and File
        let guichets = await loadFromAsyncStorage();
        guichets.push(newGuichet);

        // Save the new list to both AsyncStorage and the file
        await saveToAsyncStorage(guichets);
        await saveToFile(guichets);

        // Call the passed callback to refresh the list
        if (route.params?.onGuichetAdded) {
            route.params.onGuichetAdded();  // Refresh the list
        }
        // Navigate back to ListeGuichets
        navigation.navigate('ListeGuichets');
    };

    return (
        <View style={styles.container}>

            {/* Photo Picker */}
            <View style={styles.photoSection}>
                <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
                    {photo ? (
                        <Image source={{ uri: photo }} style={styles.photo} />
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            {/* Wrap text inside a <Text> component */}
                            <Icon name="business" size={30} color="#aaa" />
                        </View>
                    )}
                </TouchableOpacity>
                <View style={styles.textSection}>
                    <Text style={styles.instructionText}>Formats autorisées : png et svg</Text>
                    <Text style={styles.instructionText}>Taille maximale autorisée : 2 Mo</Text>
                    <Text style={styles.instructionText}>Dimentions idéales de l'image : 100px * 100px</Text>
                </View>
            </View>

            <Text style={styles.label}>Nom:</Text>
            <TextInput
                style={styles.input}
                placeholder="Entrez le nom"
                value={nom}
                onChangeText={setNom}
            />

            {/* Role - Dropdown */}
            <Text style={styles.label}>Role:</Text>
            <View style={styles.dropdownInput}>

                <Picker
                    selectedValue={role}
                    onValueChange={(itemValue) => setRole(itemValue)}


                >
                    <Picker.Item label="Banque" value="Banque" style={styles.pickerItem} />
                    <Picker.Item label="Aéroport" value="Aéroport" style={styles.pickerItem} />

                </Picker>
            </View>

            {/* Statut - Toggle */}
            <Text style={styles.label}>Statut:</Text>
            <View style={styles.dropdownInput}>


                <Picker
                    selectedValue={statut}
                    onValueChange={(itemValue) => setStatut(itemValue)}

                >
                    <Picker.Item label="Actif" value="Actif" style={styles.pickerItem} />
                    <Picker.Item label="Inactif" value="Inactif" style={styles.pickerItem} />
                </Picker>
            </View>



            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    input: { borderWidth: 1, marginVertical: 10, padding: 15 },
    dropdownInput: { borderWidth: 1, marginVertical: 10 },

    label: {
        fontSize: 12
        ,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    photoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    textSection: {
        flex: 1,
        marginLeft: 10,

    },
    instructionText: {
        fontSize: 11,
        color: 'gray',
    },
    imagePreview: {
        width: 200,
        height: 200,
        marginTop: 20,
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    pickerItem: {
        fontSize: 13, // Adjust the font size for items here
        color: '#333',
        fontWeight: 'bold',

    },
    photoContainer: {
        alignSelf: 'left',
        marginBottom: 20,
    },

    photo: {
        width: 100,
        height: 100,
        borderRadius: 50, // Circular shape
        borderWidth: 2,
        borderColor: '#ccc',
    },
    photoPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 500
    },
    button: {
        alignSelf: 'flex-end', // Align the button to the right
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
    },

});

export default AjouterGuichet;
