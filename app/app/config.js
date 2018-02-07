import { Platform } from 'react-native';

export const DOMAIN = (Platform.OS === 'ios') ? "http://localhost:3000" : "http://mytesttodo.app:3000";