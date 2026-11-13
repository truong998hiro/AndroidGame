package com.becomingalegend.game

import android.os.Bundle
import android.view.WindowManager
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.becomingalegend.game.ads.AdManager
import com.becomingalegend.game.databinding.ActivityMainBinding

/**
 * Main entry point of the game.
 * Sets up full-screen immersive mode, the game view, and ad integration.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var gameView: GameView
    private lateinit var adManager: AdManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Full-screen immersive mode
        setupFullScreen()

        // Inflate layout
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Initialize game view
        gameView = binding.gameView

        // Initialize ads
        adManager = AdManager(this)
        adManager.loadBannerAd(binding.adViewContainer)
        adManager.loadInterstitialAd()
        adManager.loadRewardedAd()
    }

    /**
     * Configure full-screen immersive mode (hide status bar & nav bar).
     */
    private fun setupFullScreen() {
        // Keep screen on while playing
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        // Edge-to-edge display
        WindowCompat.setDecorFitsSystemWindows(window, false)
        val controller = WindowInsetsControllerCompat(window, window.decorView)
        controller.hide(WindowInsetsCompat.Type.systemBars())
        controller.systemBarsBehavior =
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
    }

    override fun onResume() {
        super.onResume()
        gameView.resume()
    }

    override fun onPause() {
        super.onPause()
        gameView.pause()
    }

    /**
     * Show an interstitial ad (e.g., between levels).
     */
    fun showInterstitialAd(onAdDismissed: () -> Unit = {}) {
        adManager.showInterstitialAd(this, onAdDismissed)
    }

    /**
     * Show a rewarded ad (e.g., for extra lives).
     */
    fun showRewardedAd(onRewarded: (type: String, amount: Int) -> Unit) {
        adManager.showRewardedAd(this, onRewarded)
    }
}

