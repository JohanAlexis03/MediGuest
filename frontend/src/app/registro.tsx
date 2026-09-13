import { useState } from 'react';
import { View, Text, TextInput,Pressable, StyleSheet} from 'react-native';
import { Image } from 'expo-image';

export default function RegistroScreen() {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');

    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/Logo_MediQuest_v1.svg')}
                style={styles.logo}
                contentFit="contain"
            />

            <Text style={styles.titulo}>Crear cuenta</Text>
            
            <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
            />

            <TextInput
                style={styles.input}
                placeholder="Apellido"
                value={apellido}
                onChangeText={setApellido}
                autoCapitalize="words"
            />

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={correo}
                onChangeText={setCorreo}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={contrasena}
                onChangeText={setContrasena}
                secureTextEntry
            />

            <Pressable style={styles.boton} onPress={() => {}}>
                <Text style={styles.botonTexto}>Registrarse</Text>
            </Pressable>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 16,
    },
    logo: {
        width: 120,
        height: 120,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0b3d91',
    },
    input: {
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    boton: {
        width: '100%',
        height: 48,
        backgroundColor: '#0b3d91',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botonTexto: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});


