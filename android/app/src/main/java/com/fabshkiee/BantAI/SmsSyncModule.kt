package com.fabshkiee.BantAI

import android.content.Context
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray

import android.content.BroadcastReceiver
import android.content.Intent
import android.content.IntentFilter
import androidx.core.content.ContextCompat
import com.facebook.react.modules.core.DeviceEventManagerModule

class SmsSyncModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val receiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            if (intent.action == "com.fabshkiee.BantAI.NEW_ALERT") {
                sendEvent("onNewNDRRMCAlert", null)
            }
        }
    }

    init {
        val filter = IntentFilter("com.fabshkiee.BantAI.NEW_ALERT")
        // No exported = true needed for internal app broadcast
        val receiverFlags = ContextCompat.RECEIVER_NOT_EXPORTED
        ContextCompat.registerReceiver(reactContext, receiver, filter, receiverFlags)
    }

    override fun getName(): String {
        return "SmsSyncModule"
    }

    private fun sendEvent(eventName: String, params: WritableArray?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    @ReactMethod
    fun getPendingAlerts(promise: Promise) {
        try {
            val prefs = reactApplicationContext.getSharedPreferences(NdrrmcSmsReceiver.PREFS_NAME, Context.MODE_PRIVATE)
            val pendingSet = prefs.getStringSet(NdrrmcSmsReceiver.KEY_ALERTS, mutableSetOf()) ?: mutableSetOf()
            
            val resultList: WritableArray = Arguments.createArray()
            for (alert in pendingSet) {
                resultList.pushString(alert)
            }
            
            // Clear the set after reading
            prefs.edit().remove(NdrrmcSmsReceiver.KEY_ALERTS).apply()
            
            promise.resolve(resultList)
        } catch (e: Exception) {
            promise.reject("SYNC_ERROR", "Failed to get pending NDRRMC alerts", e)
        }
    }
}
