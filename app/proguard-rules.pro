# ProGuard rules for Becoming A Legend

# ── Google Mobile Ads ──
-keep class com.google.android.gms.ads.** { *; }
-keep class com.google.ads.** { *; }
-dontwarn com.google.android.gms.ads.**

# ── Google Play Billing ──
-keep class com.android.vending.billing.** { *; }

# ── Keep game classes ──
-keep class com.becomingalegend.game.** { *; }

# ── General Android ──
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ── Kotlin Coroutines ──
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}
-keepclassmembers class kotlinx.coroutines.** {
    volatile <fields>;
}

