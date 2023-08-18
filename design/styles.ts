// Styles.ts
import { AppTheme } from '../design/themes';

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
  section: object;
  themeToggleContainer: object;
  title: object;
  toggleText: object;
  modalTitle: object;
  picker: object;
  datePicker: object;
  notificationCard: object;
  buttonText: object;
  cancelButton: object;
  saveButton: object;
  modalButton: object;
  actionButton: object;
  rectangularButton: object;
  rectangularButtonText: object;
};

const getStyles = (theme: AppTheme): StyleType => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    padding: 15,
    paddingTop: 0,
    paddingHorizontal: 25,
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
    backgroundColor: theme.colors.primary,
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
    height: 50,
    width: 250,
    alignSelf: 'center',
    backgroundColor: theme.colors.background,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  fieldContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 10,
    backgroundColor: theme.colors.secondary,
  },
  phoneNumberInput: {
    marginBottom: 10,
    backgroundColor: theme.colors.secondary,
  },
  phoneNumberTextContainer: {
    backgroundColor: theme.colors.secondary,
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
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  themeToggle: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    margin: 5,
    borderRadius: 10,
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
    backgroundColor:theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginVertical: 10,
    width: '100%',
    paddingBottom: 15,
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.colors.text,
  },
  toggleText: {
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: theme.colors.text,
  },
  picker: {
    height: 50,
    width: 250,
    alignSelf: 'center',
    backgroundColor: theme.colors.secondary,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: 10,
  },
  datePicker: {
    height: 50,
    width: 250,
    alignSelf: 'center',
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    borderRadius: 10,
  },
  notificationCard: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: theme.colors.onSurface,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2.62,
    elevation: 4,
  },
    buttonText: {
    color: 'rgb(255, 255, 255)',
    fontWeight: 'bold',
    fontSize: 18,
    borderColor: theme.colors.background,
  },
    cancelButton: {
    backgroundColor: theme.colors.error,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: theme.colors.background,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
    modalButton: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: theme.colors.background,
    borderRadius: 5,
    alignItems: 'center',
  },
  actionButton: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: theme.colors.background,
    borderRadius: 5,
    alignItems: 'center',
},
      rectangularButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 25,
      paddingVertical: 10,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
    },
    rectangularButtonText: {
      color: 'rgb(255, 255, 255)',
      fontWeight: 'bold',
      fontSize: 16,
    },

});

export default getStyles;