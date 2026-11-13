package com.becomingalegend.game

import android.app.Application
import com.google.android.gms.ads.MobileAds
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/**
 * Application class — initializes core SDKs.
 */
class GameApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        // Initialize Mobile Ads SDK on a background thread
        CoroutineScope(Dispatchers.IO).launch {
            MobileAds.initialize(this@GameApplication)
        }
    }
}

