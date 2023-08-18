package com.unibe.vitalinker;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

public class VitaLinker extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        // This method is called when the BroadcastReceiver is receiving an Intent broadcast.
        Toast.makeText(context, "Intent Detected.", Toast.LENGTH_LONG).show();
    }
}