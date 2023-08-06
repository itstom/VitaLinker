// Styles.ts
import { StyleSheet } from 'react-native';
import { AppTheme } from './themes';

export interface ThemeType {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
  dark: boolean;
}

type StyleType = {
  container: object;
  text: object;
  button: object;
  roundedButton: object;
  input: object;
  centeredView: object;
  fieldContainer: object;
  phoneNumberInput: object;
  phoneNumberTextContainer: object;
  phoneNumberText: object;
  phoneNumberFlagButton: object;
  containerStyle: object;
  themeToggle: object;
  overlayStyle: object;
};

const getStyles = (theme: AppTheme): StyleType => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 10,
  },
  roundedButton: {
    borderRadius: 20,
    height: 50,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: theme.colors.background,
    marginTop: 10,
    marginBottom: 10,
    height: 50,
    width: 250,
    alignSelf: 'center',
    mode: 'outlined',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  fieldContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 10,
  },
  phoneNumberInput: {
    marginBottom: 10,
  },
  phoneNumberTextContainer: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary,
  },
  phoneNumberText: {
    fontSize: 16,
    padding: 10,
    color: theme.colors.text,
  },
  phoneNumberFlagButton: {
    borderColor: theme.colors.primary,
    marginLeft: -10,
    padding: 5,
  },
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    
    backgroundColor: theme.colors.background,
  },
  themeToggle: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    margin: 5,
    borderRadius: 10,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    transition: 'background-color 0.25 ease-in-out',
  },
  overlayStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor:'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default getStyles;