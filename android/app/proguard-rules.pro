# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# ========== STANDARD OPTIMIZATIONS ==========
-optimizationpasses 3
-allowaccessmodification
-overloadaggressively
-repackageclasses ''
-dontusemixedcaseclassnames
-dontpreverify

# Remove debug logging in production (keeps error logs)
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
    public static *** w(...);
}

# Keep crash reporting info
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
-keepattributes Signature, *Annotation*

# ========== REACT NATIVE CORE ==========
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.soloader.** { *; }

# Bridge & Native Modules
-keep public class * extends com.facebook.react.bridge.NativeModule { *; }
-keep class com.facebook.react.bridge.** { *; }
-keepclassmembers class * { @com.facebook.react.bridge.ReactMethod *; }
-keepclassmembers class * { @com.facebook.proguard.annotations.DoNotStrip *; }

# UI Manager & View System
-keep @com.facebook.react.uimanager.annotations.ReactProp class * { *; }
-keep @com.facebook.react.uimanager.annotations.ReactPropGroup class * { *; }
-keep class * extends com.facebook.react.uimanager.ViewManager { *; }
-keep class com.facebook.react.uimanager.** { *; }

# TurboModules (New Architecture)
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.animated.** { *; }
-keep class com.facebook.react.common.** { *; }

# ========== COMMON LIBRARIES ==========
# Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.** { *; }
-dontwarn com.swmansion.**

# SVG
-keep public class com.horcrux.svg.** { *; }

# OKIO / OKHTTP
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**

# ========== EXPO MODULES & KOTLIN ==========
-keep class expo.modules.** { *; }
-keep class com.facebook.react.devsupport.** { *; }
-dontwarn expo.modules.**
-dontwarn com.facebook.react.devsupport.**

# ========== AI / TFLITE ==========
-keep class com.tflite.** { *; }
-keep class com.mrousavy.camera.frameprocessor.** { *; }
-dontwarn com.tflite.**

# ========== REINFORCED AI RULES ==========
-keep class org.tensorflow.** { *; }
-keep class com.google.android.gms.tflite.** { *; }
-dontwarn org.tensorflow.**
-dontwarn com.google.android.gms.tflite.**

# ========== Bantai Custom Bridge ==========
-keep class com.fabshkiee.BantAI.** { *; }
-keep interface com.fabshkiee.BantAI.** { *; }
-keep public class * extends com.facebook.react.bridge.NativeModule
-keep public class * extends com.facebook.react.ReactPackage
