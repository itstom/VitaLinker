import BleManager from 'react-native-ble-manager';
import { Action, Dispatch } from 'redux';
import { SensorState, updateSensorDataAction } from '../redux/sensorSlice';
import { RootState } from '../redux/store';
import { ThunkAction } from '@reduxjs/toolkit';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { DeviceEventEmitter, Platform, NativeEventEmitter } from 'react-native';

const MAX_HISTORY = 100;
const SERVICE_UUID = "0000180f-0000-1000-8000-00805f9b34fb";
const TEMP_CHARACTERISTIC_UUID = "00002a6e-0000-1000-8000-00805f9b34fb";
const DEVICE_ID = "66:55:7F:20:84:15"; 

interface Peripheral {
    id: string;
    name: string;
}

const parseData = (rawData: string): SensorState => {
    const tempMatch = rawData.match(/TEMP: (\d+\.\d+)/);
    const locationMatch = rawData.match(/, (.*?), HR=/);
    const hrMatch = rawData.match(/HR=(\d+), HRvalid=(\d+)/);
    const spo2Match = rawData.match(/SPO2=(\d+), SPO2Valid=(\d+)/);
    const temperature = tempMatch ? parseFloat(tempMatch[1]) : 0;
    const location = locationMatch ? locationMatch[1] : 'Unknown';
    const heartRate = hrMatch ? parseInt(hrMatch[1]) : 0;
    const spo2 = spo2Match ? parseInt(spo2Match[1]) : 0;
    const hrValid = hrMatch ? Boolean(parseInt(hrMatch[2])) : false;
    const spo2Valid = spo2Match ? Boolean(parseInt(spo2Match[2])) : false;

    return {
        avg24h: temperature,
        avg7d: temperature,
        avg1m: temperature,
        temperatureHistory: [temperature],
        locationHistory: [location],
        heartRateHistory: [heartRate],
        spo2History: [spo2],
        temperatureTimestamps: [new Date().toISOString()],
        locationTimestamps: [new Date().toISOString()],
        heartRateTimestamps: [new Date().toISOString()],
        spo2Timestamps: [new Date().toISOString()],
        temperature,
        location,
        heartRate,
        spo2,
        hrValid,
        spo2Valid
    };
};

const requestBluetoothPermission = async () => {
    const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  
    switch(status) {
      case RESULTS.GRANTED:
        return true;
      case RESULTS.UNAVAILABLE:
        console.warn('This feature is not available on your device.');
        return false;
      case RESULTS.DENIED:
        const newStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        if (newStatus === RESULTS.GRANTED) {
          return true;
        } else {
          console.warn('Bluetooth permission denied');
          return false;
        }
      case RESULTS.BLOCKED:
        console.warn('Bluetooth permission blocked');
        return false;
    }
};
  
export const initializeBleManager = () => {
    BleManager.start({ showAlert: false });
};

export const scanAndConnect = async (deviceId: string = DEVICE_ID): Promise<Peripheral | null> => {
    const hasPermission = await requestBluetoothPermission();
    if (!hasPermission) {
        console.warn("Bluetooth permission is not granted.");
        return null;
    }

    console.log('Starting device scan...');
    let foundDevice: Peripheral | null = null;

    const subscription = DeviceEventEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        (peripheral: Peripheral) => {
            console.log('Found device:', peripheral.name, peripheral.id);
            if (peripheral.id === DEVICE_ID) {
                foundDevice = peripheral;
                BleManager.stopScan();
            }
        }
    );
    await BleManager.scan([], 20, true);

    const scanTimeout = setTimeout(() => {
        if (!foundDevice) {
            BleManager.stopScan();
            console.warn('Scan timeout reached. Stopping scan.');
            subscription.remove();
        }
    }, 20000);

    return foundDevice;
};

const fetchDataFromDevice = async (peripheral: Peripheral) => {
    try {
        const data = await BleManager.read(peripheral.id, SERVICE_UUID, TEMP_CHARACTERISTIC_UUID);
        const rawData = Buffer.from(data).toString('ascii');
        return parseData(rawData);
    } catch (error) {
        console.error("Failed to fetch data:", error);
        return null;
    }
};

export const startDataPolling = (intervalDuration = 5000, targetDeviceId: string = DEVICE_ID): ThunkAction<Promise<NodeJS.Timeout | undefined>, RootState, unknown, Action<string>> => {
    return async (dispatch: Dispatch): Promise<NodeJS.Timeout | undefined> => {
        let peripheral: Peripheral | null;
        try {
            peripheral = await scanAndConnect(targetDeviceId);
            if (!peripheral) {
                console.warn('No peripheral device found.');
                return undefined;
            }
        } catch (err) {
            console.warn('Unable to establish connection with device.');
            return undefined;
        }

        const interval = setInterval(async () => {
            try {
                if (peripheral) {
                    const sensorData = await fetchDataFromDevice(peripheral);
                    if (sensorData) {
                        dispatch(updateSensorDataAction(sensorData));
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }, intervalDuration);

        return interval;
    };
};

export const stopDataPolling = (intervalId: any) => {
    return () => {
        clearInterval(intervalId);
    };
};