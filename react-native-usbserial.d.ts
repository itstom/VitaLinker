// types/react-native-usbserial.d.ts
declare module 'react-native-usbserial' {
    export type Device = {
        name: string;
        id: number;
        // ... other properties
    };

    export class UsbSerial {
        constructor(device: Device);
        static listDevices(): Promise<Device[]>;
        open(): Promise<void>;
        close(): Promise<void>;
        isOpen: boolean;
        read(): Promise<Buffer>; // or whatever type is returned.
        // ... other methods
    }
}