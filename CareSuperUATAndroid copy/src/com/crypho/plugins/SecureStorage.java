package com.crypho.plugins;

import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.security.KeyPairGeneratorSpec;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyPairGenerator;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.UnrecoverableEntryException;
import java.util.Calendar;
import java.util.Hashtable;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.security.auth.x500.X500Principal;

/**
 * @Sagar this plugin has been modified to meet the requirements
 * Refer the preference class under L&T package for some methods
 */
public class SecureStorage extends CordovaPlugin {
  private static final String TAG = "SecureStorage";

  private static final boolean SUPPORTS_NATIVE_AES = Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP;
  private static final boolean SUPPORTED = Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT;

  private static final String MSG_NOT_SUPPORTED = "API 19 (Android 4.4 KitKat) is required. This device is running API " + Build.VERSION.SDK_INT;
  private static final String MSG_DEVICE_NOT_SECURE = "Device is not secure";

  private Hashtable<String, SharedPreferencesHandler> SERVICE_STORAGE = new Hashtable<String, SharedPreferencesHandler>();
  private String INIT_SERVICE;
  private volatile CallbackContext initContext, secureDeviceContext;
  private volatile boolean initContextRunning = false;
  private SecureDataManager secureDataManager;

  private String iv = "1234123412341234";
    private static SecureStorage mSecureStorage = null;

    public static SecureStorage getSecureStorage(){
        if(mSecureStorage == null){
            mSecureStorage = new SecureStorage();

        }
        return mSecureStorage;
    }
  @Override
  public void onResume(boolean multitasking) {
    if (secureDeviceContext != null) {
      secureDeviceContext.success();

    }

    if (initContext != null && !initContextRunning) {
      cordova.getThreadPool().execute(new Runnable() {
        public void run() {
          initContextRunning = true;
          try {

            initSuccess(initContext);

          } catch (Exception e) {
            Log.e(TAG, "Init failed :", e);
            initContext.error(e.getMessage());
          } finally {
            initContext = null;
            initContextRunning = false;
          }
        }
      });
    }
  }

  @Override
  public boolean execute(String action, CordovaArgs args, final CallbackContext callbackContext) throws JSONException {
    if(!SUPPORTED){
      Log.w(TAG, MSG_NOT_SUPPORTED);
      callbackContext.error(MSG_NOT_SUPPORTED);
      return false;
    }
    if ("init".equals(action)) {
      String service = args.getString(0);
      String alias = service2alias(service);
      INIT_SERVICE = service;

      SharedPreferencesHandler PREFS = new SharedPreferencesHandler(alias + "_SS", getContext());
      SERVICE_STORAGE.put(service, PREFS);

      try {
        if(!RSA.isEntryAvailable(alias)){
          getStorage(INIT_SERVICE).clear();
          RSA.createKeyPair(getContext(),service2alias(INIT_SERVICE));
        }
      } catch (Exception e) {
        e.printStackTrace();
      }

      secureDataManager = new SecureDataManager(cordova.getActivity());
      initSuccess(callbackContext);
      return true;
    }
    if ("set".equals(action)) {

      final String key = args.getString(1);
      final String value = args.getString(2);
      cordova.getThreadPool().execute(new Runnable() {
        public void run() {
          try {
            secureDataManager.storeValue(key,value);
            callbackContext.success();
          } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
          }
        }
      });
      return true;

    }
    if ("get".equals(action)) {

      final String key = args.getString(1);
      cordova.getThreadPool().execute(new Runnable() {
        public void run() {
          try {
            String valueToReturn = secureDataManager.getValue(key);
            if(valueToReturn.isEmpty()){
              callbackContext.error("Empty error");
            }
            callbackContext.success(valueToReturn);
          } catch (Exception e) {
            callbackContext.error(e.getMessage());
            e.printStackTrace();
          }
        }
      });
      return true;
    }
    if ("decrypt_rsa".equals(action)) {
      final String service = args.getString(0);
      // getArrayBuffer does base64 decoding
      final byte[] decryptMe = args.getArrayBuffer(1);
      cordova.getThreadPool().execute(new Runnable() {
        public void run() {
          try {
//            String valueToReturn = secureDataManager.getValue(service2alias(service));
//            callbackContext.success(valueToReturn);
            byte[] decrypted = RSA.decrypt(decryptMe, service2alias(service));
            callbackContext.success(new String (decrypted));
          } catch (Exception e) {
            Log.e(TAG, "Decrypt (RSA) failed :", e);
            callbackContext.error(e.getMessage());
          }
        }
      });
      return true;
    }
    if ("encrypt_rsa".equals(action)) {
      final String service = args.getString(0);
      final String encryptMe = args.getString(1);
      cordova.getThreadPool().execute(new Runnable() {
        public void run() {
          try {
//            secureDataManager.storeValue(service,encryptMe);
//            callbackContext.success();
            byte[] encrypted = RSA.encrypt(encryptMe.getBytes(), service2alias(service));
            callbackContext.success(Base64.encodeToString(encrypted, Base64.DEFAULT));
          } catch (Exception e) {
            Log.e(TAG, "Encrypt (RSA) failed :", e);
            callbackContext.error(e.getMessage());
          }
        }
      });
      return true;
    }

    if ("secureDevice".equals(action)) {
      secureDeviceContext = callbackContext;
      return true;
    }
    //SharedPreferences interface
    if ("remove".equals(action)) {
      String service = args.getString(0);
      String key = args.getString(1);
      secureDataManager.removeValue(key);
      callbackContext.success();
      return true;
    }
    if ("store".equals(action)) {
      String service = args.getString(0);
      String key = args.getString(1);
      String value = args.getString(2);
      getStorage(service).store(key, value);
      callbackContext.success();
      return true;
    }
    if ("fetch".equals(action)) {
      String service = args.getString(0);
      String key = args.getString(1);
      String value = getStorage(service).fetch(key);
      if (value != null) {
        callbackContext.success(value);
      } else {
        callbackContext.error("Key [" + key + "] not found.");
      }
      return true;
    }
    if ("keys".equals(action)) {
      String service = args.getString(0);
      callbackContext.success(new JSONArray(getStorage(service).keys()));
      return true;
    }
    if ("clear".equals(action)) {
      String service = args.getString(0);
      getStorage(service).clear();
      callbackContext.success();
      return true;
    }
    return false;
  }

  private String service2alias(String service) {
    String res = getContext().getPackageName() + "." + service;
    return  res;
  }

  private SharedPreferencesHandler getStorage(String service) {
    return SERVICE_STORAGE.get(service);
  }

  private void initSuccess(CallbackContext context) {
    // 0 is falsy in js while 1 is truthy
    context.success(SUPPORTS_NATIVE_AES ? 1 : 0);
  }

  private Context getContext() {
    return cordova.getActivity().getApplicationContext();
  }

  private void startActivity(Intent intent) {
    cordova.getActivity().startActivity(intent);
  }

  class SecureDataManager {

    private final Context context;
    private static final String KEY_ALIAS = "GBGOFirstConnect";
    private static final String KEY_TYPE = "AndroidKeyStore";
    private static final String RSA_MODE = "RSA/ECB/PKCS1Padding";
//    private static final String RSA_MODE_M = "RSA/ECB/OAEPWithSHA-256AndMGF1Padding";
    private static final String RSA_MODE_M = "RSA/ECB/OAEPwithSHA-512andMGF1Padding";

    private static final String AES_MODE = "AES/GCM/NOPADDING";
    private KeyStore keyStore;

    public SecureDataManager(Context context) {
      this.context = context;
      try {
        keyStore = KeyStore.getInstance(KEY_TYPE);
        keyStore.load(null);
        genkey();

      } catch (Exception e) {
        e.printStackTrace();
      }
    }

    private void genkey() {

      try {
        if (!keyStore.containsAlias(KEY_ALIAS)) {
          KeyPairGenerator generator = KeyPairGenerator.getInstance(KeyProperties.KEY_ALGORITHM_RSA,
            KEY_TYPE);
          Calendar start = Calendar.getInstance();
          Calendar end = Calendar.getInstance();
          end.add(Calendar.YEAR, 30);
          if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            //Api level 23

            KeyGenParameterSpec spec = new KeyGenParameterSpec.Builder(
              KEY_ALIAS,
              KeyProperties.PURPOSE_DECRYPT | KeyProperties.PURPOSE_ENCRYPT)
              .setDigests(KeyProperties.DIGEST_SHA256, KeyProperties.DIGEST_SHA512)
              .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_RSA_OAEP)
              .setKeyValidityStart(start.getTime())
              .setKeyValidityEnd(end.getTime())
              .build();
            generator.initialize(spec);
          } else {
            //api level 17+ 4.4.3
            //noinspection deprecation
            KeyPairGeneratorSpec spec = new KeyPairGeneratorSpec.Builder(context)
              .setAlias(KEY_ALIAS)
              .setSubject(new X500Principal("CN=Sample Name, O=Android Authority"))
              .setSerialNumber(BigInteger.ONE)
              .setStartDate(start.getTime())
              .setEndDate(end.getTime())
              .build();
            generator.initialize(spec);
          }
          generator.generateKeyPair();
        }
      } catch (Exception e) {
        e.printStackTrace();
      }
    }

    private String doEncryption(String input) {
      try {
        KeyStore.PrivateKeyEntry privateKeyEntry = (KeyStore.PrivateKeyEntry) keyStore.getEntry(KEY_ALIAS, null);
        PublicKey publicKey = privateKeyEntry.getCertificate().getPublicKey();
//        Cipher c;
//        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
//          c = Cipher.getInstance(RSA_MODE_M);
//        } else {
//          c = Cipher.getInstance(RSA_MODE);
//        }
//
//        c.init(Cipher.ENCRYPT_MODE, publicKey);
//        byte[] encodedUser = c.doFinal(input.getBytes(StandardCharsets.UTF_8));
//
//        return Base64.encodeToString(encodedUser, Base64.DEFAULT);

        CryptLib cryptLib = new CryptLib();
        return cryptLib.encryptSimple(input, KEY_ALIAS, iv);

      } catch (NoSuchAlgorithmException e) {
        e.printStackTrace();
      } catch (BadPaddingException e) {
        e.printStackTrace();
      } catch (KeyStoreException e) {
        e.printStackTrace();
      } catch (IllegalBlockSizeException e) {
        e.printStackTrace();
      } catch (InvalidKeyException e) {
        e.printStackTrace();
      } catch (UnrecoverableEntryException e) {
        e.printStackTrace();
      } catch (NoSuchPaddingException e) {
        e.printStackTrace();
      } catch (InvalidAlgorithmParameterException e) {
        e.printStackTrace();
      } catch (UnsupportedEncodingException e) {
        e.printStackTrace();
      }

      return input;
    }

    private String doDecryption(String input) {
      try {
        KeyStore.PrivateKeyEntry privateKeyEntry = (KeyStore.PrivateKeyEntry) keyStore.getEntry(KEY_ALIAS, null);
        PrivateKey privateKey = privateKeyEntry.getPrivateKey();

//        Cipher c;
//        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
//          c = Cipher.getInstance(RSA_MODE_M);
//        } else {
//          c = Cipher.getInstance(RSA_MODE);
//        }
//        c.init(Cipher.DECRYPT_MODE, privateKey);
//
//        byte[] decodedUser = c.doFinal(Base64.decode(input, Base64.DEFAULT));
//        return new String(decodedUser, 0, decodedUser.length, "UTF-8");

        CryptLib cryptLib = new CryptLib();
        return cryptLib.decryptSimple(input, KEY_ALIAS, iv);

      } catch (NoSuchAlgorithmException e) {
        e.printStackTrace();
      } catch (BadPaddingException e) {
        e.printStackTrace();
      } catch (KeyStoreException e) {
        e.printStackTrace();
      } catch (IllegalBlockSizeException e) {
        e.printStackTrace();
      } catch (InvalidKeyException e) {
        e.printStackTrace();
      } catch (UnrecoverableEntryException e) {
        e.printStackTrace();
      } catch (NoSuchPaddingException e) {
        e.printStackTrace();
      } catch (UnsupportedEncodingException e) {
        e.printStackTrace();
      } catch (InvalidAlgorithmParameterException e) {
        e.printStackTrace();
      }

      return input;

    }

    public void storeValue(String key, String value) {
      String encryptedValue = doEncryption(value);
      PreferenceManager.storeValue(context, key, encryptedValue);
    }

    public String getValue(String key) {
      String encryptedValue = PreferenceManager.getStringValue(context, key);
      return doDecryption(encryptedValue);
    }

    public void removeValue(String key){
      PreferenceManager.removeValue(context,key);
    }

  }
  public String getValue(Context mContext,String key){
    String val = null;

    try {
      secureDataManager = new SecureDataManager(mContext);
      val = secureDataManager.getValue(key);
    }catch (Exception e){
      e.printStackTrace();
    }
    return val;
  }

  public void clearStorage(Context mContext){
    try {
      secureDataManager = new SecureDataManager(mContext);
      secureDataManager.removeValue("_SS_devicepin");
      secureDataManager.removeValue("_SS_quickLoginType");
    }catch(Exception e){
      e.printStackTrace();
    }
  }
}
