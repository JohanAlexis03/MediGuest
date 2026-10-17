import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Image } from 'expo-image';

export default function IndexScreen() {
    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/Logo_MediQuest_v1.svg')}
                style={styles.logo}
                contentFit="contain"
            />
            <Text style={styles.titulo}>MediQuest</Text>
            <Text style={styles.subtitulo}>Casos clínicos para estudiantes de APH</Text>

            <Link href="/login" asChild>
                <Pressable style={styles.boton}>
                    <Text style={styles.botonTexto}>Iniciar sesión</Text>
                </Pressable>
            </Link>

            <Link href="/registro" asChild>
                <Pressable style={styles.botonSecundario}>
                    <Text style={styles.botonSecundarioTexto}>Crear cuenta</Text>
                </Pressable>
            </Link>
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
        width: 140,
        height: 130,
    },
    titulo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0b3d91',
    },
    subtitulo: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 16,
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
    botonSecundario: {
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderColor: '#0b3d91',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botonSecundarioTexto: {
        color: '#0b3d91',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
