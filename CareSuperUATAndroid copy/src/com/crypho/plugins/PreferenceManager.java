package com.crypho.plugins;

import android.content.Context;
import android.content.SharedPreferences;

public class PreferenceManager {

  private static String SHARED_PREFERENCE_FILE = "mercer";

  /**
   * Store any object in shared preference with specified key.
   * @param context {@link Context}
   * @param key String key.
   * @param value Object to store in preferences.
   */
  public static void storeValue(Context context, String key, Object value) {

    SharedPreferences prefs = context.getApplicationContext().getSharedPreferences(SHARED_PREFERENCE_FILE, Context.MODE_PRIVATE);
    SharedPreferences.Editor editor = prefs.edit();
    if (value instanceof String) {
      editor.putString(key, (String) value);
    } else if (value instanceof Integer) {
      editor.putInt(key, (Integer) value);
    } else if (value instanceof Boolean) {
      editor.putBoolean(key, (Boolean) value);
    }else if (value instanceof Long) {
      editor.putLong(key, (Long) value);
    }

    editor.apply();
  }

  /**
   * Get string value for given key.
   * @param context {@link Context}
   * @param key String to get value.
   * @return {@link Boolean}
   */
  public static String getStringValue(Context context, String key) {
    SharedPreferences prefs = context.getApplicationContext().getSharedPreferences(SHARED_PREFERENCE_FILE, Context.MODE_PRIVATE);
    return prefs.getString(key, "");
  }

  /**
   * Get boolean value for give key.
   * @param context {@link Context}
   * @param key String to get value.
   * @param defaultValue Set default value if not available.
   * @return {@link Boolean}
   */
  public static boolean getBooleanValue(Context context, String key, boolean defaultValue) {
    SharedPreferences prefs = context.getApplicationContext().getSharedPreferences(SHARED_PREFERENCE_FILE, Context.MODE_PRIVATE);
    return prefs.getBoolean(key, defaultValue);
  }

  /**
   * Method to remove shared pref value
   * @param context Activity context
   * @param key key to remove
   */
  public static void removeValue(Context context, String key){
    SharedPreferences prefs = context.getApplicationContext().getSharedPreferences(SHARED_PREFERENCE_FILE, Context.MODE_PRIVATE);
    SharedPreferences.Editor editor = prefs.edit();
    editor.remove(key);
    editor.apply();
  }

}
