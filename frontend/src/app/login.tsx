import {useState} from "react";
import {View, Text, TextInput, Pressable, StyleSheet} from "react-native";
import {Image} from "expo-image";
import {Link} from "expo-router";


export default function LoginScreen() {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');

    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/Logo_MediQuest_v1.svg')}
                style={styles.logo}
                contentFit="contain"
            />
            <Text style={styles.titulo}>Iniciar sesión</Text>
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
                <Text style={styles.botonTexto}>Iniciar Sesion</Text>
            </Pressable>

            <Link href="/registro" asChild>
                <Pressable>
                    <Text style={styles.enlace}>¿No tenés cuenta? Registrate</Text>
                </Pressable>
            </Link>
        </View>

    );
}
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 16,
    },
    logo: {
        width: 150,
        height: 130,
        
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
    enlace: {
        marginTop: 8,
        color: '#0b3d91',
        fontSize: 14,
    },
});
