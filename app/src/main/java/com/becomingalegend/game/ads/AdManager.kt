package com.becomingalegend.game.ads

import android.app.Activity
import android.util.Log
import android.widget.FrameLayout
import com.becomingalegend.game.BuildConfig
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback

/**
 * Manages all ad types: Banner, Interstitial, and Rewarded.
 *
 * Ad unit IDs are configured per build type in build.gradle.kts:
 * - Debug: uses Google's official test ad IDs
 * - Release: uses your real AdMob IDs
 */
class AdManager(private val activity: Activity) {

    companion object {
        private const val TAG = "AdManager"
    }

    private var bannerAd: AdView? = null
    private var interstitialAd: InterstitialAd? = null
    private var rewardedAd: RewardedAd? = null

    // ══════════════════════════════════════════════════
    //  Banner Ad
    // ══════════════════════════════════════════════════

    /**
     * Load and display a banner ad in the given container.
     */
    fun loadBannerAd(container: FrameLayout) {
        bannerAd = AdView(activity).apply {
            setAdSize(AdSize.BANNER)
            adUnitId = BuildConfig.ADMOB_BANNER_ID
        }

        container.addView(bannerAd)
        bannerAd?.loadAd(AdRequest.Builder().build())
        Log.d(TAG, "Banner ad loaded")
    }

    fun destroyBannerAd() {
        bannerAd?.destroy()
        bannerAd = null
    }

    // ══════════════════════════════════════════════════
    //  Interstitial Ad
    // ══════════════════════════════════════════════════

    /**
     * Pre-load an interstitial ad. Call this early so the ad is ready to show.
     */
    fun loadInterstitialAd() {
        val adRequest = AdRequest.Builder().build()
        InterstitialAd.load(
            activity,
            BuildConfig.ADMOB_INTERSTITIAL_ID,
            adRequest,
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) {
                    interstitialAd = ad
                    Log.d(TAG, "Interstitial ad loaded")
                }

                override fun onAdFailedToLoad(error: LoadAdError) {
                    interstitialAd = null
                    Log.e(TAG, "Interstitial failed to load: ${error.message}")
                }
            }
        )
    }

    /**
     * Show the interstitial ad if it's loaded.
     * @param onAdDismissed Called when the ad is dismissed — load the next ad here.
     */
    fun showInterstitialAd(activity: Activity, onAdDismissed: () -> Unit = {}) {
        val ad = interstitialAd
        if (ad != null) {
            ad.fullScreenContentCallback = object : FullScreenContentCallback() {
                override fun onAdDismissedFullScreenContent() {
                    interstitialAd = null
                    loadInterstitialAd()  // Pre-load next one
                    onAdDismissed()
                }
            }
            ad.show(activity)
        } else {
            Log.d(TAG, "Interstitial ad not ready")
            onAdDismissed()
        }
    }

    // ══════════════════════════════════════════════════
    //  Rewarded Ad
    // ══════════════════════════════════════════════════

    /**
     * Pre-load a rewarded ad.
     */
    fun loadRewardedAd() {
        val adRequest = AdRequest.Builder().build()
        RewardedAd.load(
            activity,
            BuildConfig.ADMOB_REWARDED_ID,
            adRequest,
            object : RewardedAdLoadCallback() {
                override fun onAdLoaded(ad: RewardedAd) {
                    rewardedAd = ad
                    Log.d(TAG, "Rewarded ad loaded")
                }

                override fun onAdFailedToLoad(error: LoadAdError) {
                    rewardedAd = null
                    Log.e(TAG, "Rewarded ad failed to load: ${error.message}")
                }
            }
        )
    }

    /**
     * Show the rewarded ad if it's loaded.
     * @param onRewarded Called when the user earns the reward.
     */
    fun showRewardedAd(
        activity: Activity,
        onRewarded: (type: String, amount: Int) -> Unit,
    ) {
        val ad = rewardedAd
        if (ad != null) {
            ad.fullScreenContentCallback = object : FullScreenContentCallback() {
                override fun onAdDismissedFullScreenContent() {
                    rewardedAd = null
                    loadRewardedAd()  // Pre-load next one
                }
            }
            ad.show(activity) { reward ->
                onRewarded(reward.type, reward.amount)
            }
        } else {
            Log.d(TAG, "Rewarded ad not ready")
        }
    }
}

