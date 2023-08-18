// components/fetchUSBData.ts
import { DeviceEventEmitter } from "react-native";
import { RNSerialport, definitions, actions, ReturnedDataTypes } from "react-native-serialport";

// Event Listeners
export const setupListeners = (callbacks: {
  onServiceStarted?: (response: any) => void,
  onServiceStopped?: () => void,
  onDeviceAttached?: () => void,
  onDeviceDetached?: () => void,
  onError?: (error: any) => void,
  onConnected?: () => void,
  onDisconnected?: () => void,
  onReadData?: (data: any) => void,
}) => {
  if (callbacks.onServiceStarted) {
    DeviceEventEmitter.addListener(
      actions.ON_SERVICE_STARTED,
      callbacks.onServiceStarted
    );
  }

  // Add the rest of the event listeners in a similar manner using the provided callbacks...

  RNSerialport.setReturnedDataType(definitions.RETURNED_DATA_TYPES.HEXSTRING);
  RNSerialport.setAutoConnect(true);
  RNSerialport.setAutoConnectBaudRate(115200);
  RNSerialport.startUsbService();
}

export const cleanupListeners = async () => {
  DeviceEventEmitter.removeAllListeners();
  const isOpen = await RNSerialport.isOpen();
  if (isOpen) {
    RNSerialport.disconnect();
  }
  RNSerialport.stopUsbService();
}