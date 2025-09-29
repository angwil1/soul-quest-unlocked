package com.aicompleteme.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Force local bundle loading - disable any remote server config
        this.bridge.getConfig().setString("server.url", null);
        this.bridge.getConfig().setString("server.hostname", null);
    }
}