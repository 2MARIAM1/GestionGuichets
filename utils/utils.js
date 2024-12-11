import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
const filePath = FileSystem.documentDirectory + 'guichet.json'; // Path for JSON file

// Read data from file
export const readFromFile = async () => {
    try {
        const fileExists = await FileSystem.getInfoAsync(filePath);
        if (fileExists.exists) {

            const fileContents = await FileSystem.readAsStringAsync(filePath, {
                encoding: FileSystem.EncodingType.UTF8,
            });
            return JSON.parse(fileContents);
        }
        console.log('FILE DOES NOT EXISTS !!!!!!!!!!');

        return []; // Return empty array if file doesn't exist
    } catch (error) {
        console.error('Error reading from file:', error);
        return [];
    }
};

// Save data to file
export const saveToFile = async (data) => {
    try {
        await FileSystem.writeAsStringAsync(filePath, JSON.stringify(data), {
            encoding: FileSystem.EncodingType.UTF8,
        });
    } catch (error) {
        console.error('Error saving data to file:', error);
    }
};

// Save data to AsyncStorage
export const saveToAsyncStorage = async (data) => {
    try {
        await AsyncStorage.setItem('guichets', JSON.stringify(data));
    } catch (error) {
        console.error('Error saving data to AsyncStorage:', error);
    }
};

// Load data from AsyncStorage
export const loadFromAsyncStorage = async () => {
    try {
        const storedGuichets = await AsyncStorage.getItem('guichets');
        if (storedGuichets) {
            return JSON.parse(storedGuichets);
        }
        return [];
    } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
        return [];
    }
};
