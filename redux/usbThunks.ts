import { initializeAndStartUSBDataReading, stopUSBDataReading } from '../components/fetchUSBData';

// A thunk for initializing and starting USB reading
export const initializeUSBReadingThunk = (portName: string) => async (dispatch: any, getState: any) => {
    try {
        const device = await initializeAndStartUSBDataReading(portName);
        // Here, you can dispatch a standard Redux action if you want to store the state of the USB connection or device data in the Redux store.
        dispatch({ type: "USB_INITIALIZED", payload: device });
        return device;  // You can return values from thunks, which will be available if you .then() the dispatched thunk.
    } catch (error) {
        dispatch({ type: "USB_ERROR", payload: error });
    }
};

// A thunk for stopping USB reading
export const stopUSBReadingThunk = (device: any) => async (dispatch: any) => {
    try {
        await stopUSBDataReading(device);
        dispatch({ type: "USB_STOPPED" });
    } catch (error) {
        dispatch({ type: "USB_ERROR", payload: error });
    }
};