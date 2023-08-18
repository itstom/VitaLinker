package com.unibe.vitalinker;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.hardware.usb.UsbDevice;
import android.hardware.usb.UsbManager;
import android.content.Context;
import android.content.Intent;

import java.util.HashMap;

public class USBModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private UsbManager usbManager;

    USBModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        usbManager = (UsbManager) context.getSystemService(Context.USB_SERVICE);
    }

    @Override
    public String getName() {
        return "USBModule";
    }

    @ReactMethod
    public void getDeviceList() {
        HashMap<String, UsbDevice> deviceList = usbManager.getDeviceList();
        if (deviceList.isEmpty()) {
            // No USB device connected
        } else {
            for (UsbDevice device : deviceList.values()) {
                // We have a connected USB device. You can check device details here.
                if (device.getVendorId() == 2341 && device.getProductId() == 0x805A) {
                    // We found our device!
                    // Next, we can request permission and start reading data.
                }
            }
        }
    }
}