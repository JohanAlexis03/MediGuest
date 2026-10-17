import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';



import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack>
        <Stack.Screen name="index" options={{ title: 'MediQuest', headerShown: false }} />
        <Stack.Screen name="registro" options={{ title: 'Registro' }} />
        <Stack.Screen name="login" options={{ title: 'Iniciar sesión' }} />
        <Stack.Screen name="cases/index" options={{ title: 'Casos Clínicos APH' }} />
        <Stack.Screen name="cases/[id]" options={{ title: 'Ficha Clínica' }} />
        <Stack.Screen name="cases/solve" options={{ title: 'Resolución de Caso' }} />
      </Stack>
    </ThemeProvider>
  );
}