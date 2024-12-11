import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet, Button, Image, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import { loadFromAsyncStorage, saveToAsyncStorage, saveToFile, readFromFile } from '../utils/utils'; // Import utility functions


const ListeGuichets = ({ navigation }) => {
    const [guichets, setGuichets] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedGuichets, setSearchedGuichets] = useState([]);

    // Fetch data from AsyncStorage or file on load
    useEffect(() => {
        const loadGuichets = async () => {
            let storedGuichets = await loadFromAsyncStorage();
            // if (storedGuichets.length === 0) {
            //     storedGuichets = await readFromFile();
            //     if (storedGuichets.length > 0) {
            //         await saveToAsyncStorage(storedGuichets);
            //     }
            // }
            setGuichets(storedGuichets);
            setSearchedGuichets(storedGuichets);
        };
        loadGuichets();
    }, []);

    useEffect(() => {
        // Filter based on search text
        if (searchText) {
            const filtered = guichets.filter((item) =>
                item.nom.toLowerCase().includes(searchText.toLowerCase())
            );
            setSearchedGuichets(filtered);
        } else {
            setSearchedGuichets(guichets);
        }
    }, [searchText, guichets]);

    // Toggle favorite status of a guichet
    const toggleFavori = async (id) => {
        const updatedGuichets = guichets.map((guichet) =>
            guichet.id === id ? { ...guichet, favori: !guichet.favori } : guichet
        );
        setGuichets(updatedGuichets);
        await saveToAsyncStorage(updatedGuichets);
        await saveToFile(updatedGuichets);
    };
    // Filter the guichets based on the favorite status
    // const filteredGuichets = isFavorite
    //     ? guichets.filter((guichet) => guichet.favori)
    //     : guichets;

    // console.log("Filtered Guichets: ", filteredGuichets);

    // Toggle the filter state when the button is clicked
    const toggleFilter = () => {
        setIsFavorite((prevState) => !prevState);
        if (isFavorite) {
            setSearchedGuichets(guichets.filter(item => item.favori));
        } else {
            setSearchedGuichets(guichets);
        }
    };
    // Delete a guichet
    const supprimerGuichet = async (id) => {
        const updatedGuichets = guichets.filter((guichet) => guichet.id !== id);
        setGuichets(updatedGuichets);
        await saveToAsyncStorage(updatedGuichets);
        await saveToFile(updatedGuichets);
    };
    const refreshGuichets = async () => {
        let storedGuichets = await loadFromAsyncStorage();
        setGuichets(storedGuichets);
    };

    return (
        <View style={styles.container}>

            <View style={styles.buttonTopRow}>
                <TouchableOpacity
                    style={[styles.filterButton, isFavorite && styles.filterButtonActive]}
                    onPress={toggleFilter}
                >
                    <Text style={styles.filterButtonText}>
                        {isFavorite ? 'Afficher Tout' : 'Mes Favoris'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AjouterGuichet', { onGuichetAdded: refreshGuichets })}>
                    <Text style={styles.buttonText}>Nouveau Guichet</Text>
                </TouchableOpacity>
            </View>
            <TextInput
                style={styles.searchBar}
                placeholder="Rechercher par nom ..."
                value={searchText}
                onChangeText={setSearchText}
            />
            <FlatList
                data={searchedGuichets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.actions}>
                            <TouchableOpacity onPress={() => toggleFavori(item.id)}>
                                <Icon
                                    name="star"
                                    size={20}
                                    color={item.favori ? 'gold' : 'gray'}
                                    type="font-awesome"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => supprimerGuichet(item.id)}>
                                <Icon name="trash" color="red" type="font-awesome" size={20} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.photoContainer}>
                            {item.photo ? (
                                <Image source={{ uri: item.photo }} style={styles.photo} />
                            ) : (
                                <View style={styles.photoPlaceholder}>


                                    <Icon name="business" size={20} color="#aaa" />
                                </View>
                            )}
                        </View>
                        <Text style={styles.role}>{item.role}</Text>


                        <View style={styles.bottomRow}>
                            <Text style={styles.name}>{item.nom} {item.nom ? "✅" : ""}</Text>
                            <Text style={styles.status}>{item.statut}</Text>
                        </View>


                    </View>
                )}
            />

        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        flexDirection: "column", padding: 10, backgroundColor: 'white', flex: 1,
    },
    searchBar: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        fontSize: 12,
        borderRadius: 8,
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
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#fafafa', // Off-white background for cards
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: "#f0f0f0"

    },
    role: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: 'gray',

        marginBottom: 30,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',

        bottom: 10,

        left: 10,
        right: 10,
    },
    name: {
        fontSize: 12,


    },
    status: {
        fontSize: 12,
        fontStyle: 'italic',
        color: 'gray',
    },
    actions: { flexDirection: 'row', justifyContent: 'space-between' },

    photoContainer: {
        alignSelf: 'center',

    },

    photo: {
        width: 70,
        height: 70,
        borderRadius: 50, // Circular shape
        borderWidth: 2,
        borderColor: '#ccc',
    },
    photoPlaceholder: {
        width: 70,
        height: 70,
        borderRadius: 50,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTopRow: {

        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 10,

        Top: 10,
        left: 10,
        right: 10,
    },
    // FILTER STUFF :
    filterButton: {
        backgroundColor: '#e0e0e0',
        alignSelf: 'flex-start', // Align the button to the right
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 20,
    },
    filterButtonActive: {
        backgroundColor: '#4CAF50', // Green when active
    },
    filterButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 500
    },
});

export default ListeGuichets;
