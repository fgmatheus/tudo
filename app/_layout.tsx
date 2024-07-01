import { Stack } from 'expo-router/stack';

export default function Layout() {
  return (
    <Stack
    screenOptions={{
      headerStyle: {
        backgroundColor: 'grey',
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
    >
      <Stack.Screen name="index"
        options={{
          title: 'Locations',
        }} />
    </Stack>
  );
}