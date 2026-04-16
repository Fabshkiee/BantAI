package com.fabshkiee.BantAI

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.provider.Telephony
import android.util.Log
import androidx.core.app.NotificationCompat
import org.json.JSONObject

/**
 * Listens for incoming SMS messages and triggers a local notification
 * ONLY when the message starts with "NDRRMC". All other SMS messages
 * are silently ignored to respect user privacy.
 */
class NdrrmcSmsReceiver : BroadcastReceiver() {

    companion object {
        private const val TAG = "NdrrmcSmsReceiver"
        private const val CHANNEL_ID = "bantai_ndrrmc_alerts"
        private const val CHANNEL_NAME = "Disaster Alerts"
        private const val NOTIFICATION_ID_BASE = 9000
        const val PREFS_NAME = "BantAI_Prefs"
        const val KEY_ALERTS = "pending_ndrrmc_alerts"
    }

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Telephony.Sms.Intents.SMS_RECEIVED_ACTION) return

        val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
        if (messages.isNullOrEmpty()) return

        // Capture sender address for verification (The Annie Fix)
        val senderAddress = messages[0].originatingAddress ?: ""
        
        // Anti-Spoofing: Ignore messages from standard mobile numbers
        // Real NDRRMC alerts come from alphanumeric headers or short codes
        val mobilePattern = Regex("""^(\+639|09)\d{9}$""")
        if (mobilePattern.matches(senderAddress)) {
            Log.d(TAG, "Ignored potential fake NDRRMC alert from mobile number: $senderAddress")
            return
        }

        // Combine multi-part SMS into a single body
        val fullBody = messages.joinToString("") { it.messageBody ?: "" }

        // Privacy check: only process NDRRMC messages
        if (!fullBody.trimStart().uppercase().startsWith("NDRRMC")) {
            return
        }

        Log.d(TAG, "Verified NDRRMC alert from $senderAddress: ${fullBody.take(40)}...")

        // Create and show the notification
        showNotification(context, fullBody)
    }

    private fun showNotification(context: Context, smsBody: String) {
        // 1. Filter out non-relevant hazards (Volcanoes/Ashfall)
        val lowerBody = smsBody.lowercase()
        val ignoreKeywords = listOf("bulkang", "kanlaon", "volcano", "abu", "ashfall", "mayon", "taal")
        if (ignoreKeywords.any { lowerBody.contains(it) }) {
            Log.d(TAG, "Ignoring volcanic/ashfall alert")
            return
        }

        // 2. Parse Hazard Type & Rich Details
        var hazard = "disaster"
        var hazardAction = "detected"
        var detail = ""

        when {
            lowerBody.contains("lindol") || lowerBody.contains("earthquake") || lowerBody.contains("magnitude") -> {
                hazard = "earthquake"
                hazardAction = "incoming"
                // Extract Magnitude (e.g., 5.0)
                val magRegex = Regex("""(?:Magnitude|M)?\s?(\d+\.\d+)""", RegexOption.IGNORE_CASE)
                val mag = magRegex.find(smsBody)?.groupValues?.get(1)
                if (mag != null) detail = "$mag "
            }
            lowerBody.contains("rainfall") || lowerBody.contains("ulan") || lowerBody.contains("baha") || lowerBody.contains("flood") -> {
                hazard = "rainfall"
                hazardAction = "coming"
                // Extract Color Concern (Yellow, Orange, Red)
                val colorRegex = Regex("""(Yellow|Orange|Red)""", RegexOption.IGNORE_CASE)
                val color = colorRegex.find(smsBody)?.value
                if (color != null) detail = "${color.replaceFirstChar { it.uppercase() }} "
            }
            lowerBody.contains("bagyo") || lowerBody.contains("typhoon") || lowerBody.contains("cyclone") || lowerBody.contains("storm") -> {
                hazard = "typhoon"
                hazardAction = "coming"
            }
        }

        // 3. Parse Time (e.g., from "(11:43PM, 18Oct25)")
        val timeRegex = Regex("""\((\d{1,2}:\d{2}\s?[APM]{2})""", RegexOption.IGNORE_CASE)
        val time = timeRegex.find(smsBody)?.groupValues?.get(1) ?: "the specified time"

        // 4. Parse Location (looking for text after "sa " or "at ")
        val locationRegex = Regex("""(?:sa|at)\s+([^.]+?)(?:\s+#|kaninang|\.\s|$)""", RegexOption.IGNORE_CASE)
        val location = locationRegex.find(smsBody)?.groupValues?.get(1)?.trim() ?: "your location"

        val notificationManager =
            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        // Create notification channel (required for Android 8+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifications triggered by NDRRMC disaster alerts"
                enableVibration(true)
            }
            notificationManager.createNotificationChannel(channel)
        }

        // Deep Link Intent to open the Notifications page when the notification is tapped
        val deepLinkUri = android.net.Uri.parse("bantai://notifications")
        val launchIntent = Intent(Intent.ACTION_VIEW, deepLinkUri).apply {
            setPackage(context.packageName)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        
        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        // Dynamic strings as requested by user
        val title = "BantAI: ${detail}${hazard.replaceFirstChar { it.uppercase() }} Alert ⚠️"
        val smartMessage = "BantAI detected NDRRMC notification: ${detail.lowercase()}${hazard} ${hazardAction} at ${location} at ${time}."

        // 5. Persist for JS synchronization (The Sync Fix)
        try {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val pendingAlerts = prefs.getStringSet(KEY_ALERTS, mutableSetOf())?.toMutableSet() ?: mutableSetOf()
            
            // Format as JSON for 100% reliability (The JSON Fix)
            val json = JSONObject().apply {
                put("type", hazard)
                put("title", title)
                put("body", smartMessage)
                put("smsBody", smsBody)
            }
            
            pendingAlerts.add(json.toString())
            
            prefs.edit().putStringSet(KEY_ALERTS, pendingAlerts).apply()
            Log.d(TAG, "Alert persisted for sync: $hazard")
            
            // Trigger a broadcast so the active app knows an alert arrived
            val syncIntent = Intent("com.fabshkiee.BantAI.NEW_ALERT").apply {
                setPackage(context.packageName)
            }
            context.sendBroadcast(syncIntent)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to persist alert for sync", e)
        }

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(android.R.drawable.ic_dialog_alert)
            .setContentTitle(title)
            .setContentText(smartMessage)
            .setStyle(
                NotificationCompat.BigTextStyle()
                    .bigText("$smartMessage\n\nOpen BantAI for a quick safety scan of your home.")
            )
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .build()

        // Use SMS hash to avoid duplicate notifications for the same message
        val notificationId = NOTIFICATION_ID_BASE + smsBody.hashCode().and(0xFFF)
        notificationManager.notify(notificationId, notification)
    }
}
