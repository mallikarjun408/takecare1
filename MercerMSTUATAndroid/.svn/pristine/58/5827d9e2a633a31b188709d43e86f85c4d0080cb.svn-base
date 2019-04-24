/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.lnt.mercer;

import android.os.Bundle;
import android.util.Log;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.crypho.plugins.SecureStorage;

import org.apache.cordova.CordovaActivity;

import java.util.Date;

public class MainActivity extends CordovaActivity
{

    SecureStorage mSecureStorage = null;
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        // enable Cordova apps to be started in the background
        Bundle extras = getIntent().getExtras();
        if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
            moveTaskToBack(true);
        }

        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);
        new Thread(new Runnable() {
            @Override
            public void run() {
                try{
                    mSecureStorage = SecureStorage.getSecureStorage();
                }catch (Exception e){
                    e.printStackTrace();
                }
            }
        }).start();
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Disable caching ..
        WebView wv = (WebView) appView.getEngine().getView();
        WebSettings ws = wv.getSettings();

        ws.setJavaScriptEnabled(true);
        ws.setAppCacheEnabled(false);
        ws.setCacheMode(WebSettings.LOAD_NO_CACHE);

        // check for 90days login
        if(mSecureStorage != null) {
            try {

                String lastLoginDate = mSecureStorage.getValue(this, "_SS_lastLoginDate");
                if (lastLoginDate != null) {
                    int diffDays = getDiffbetweenDates(lastLoginDate);
                    if (diffDays > 90) {
                        mSecureStorage.clearStorage(this);
                        loadUrl(launchUrl);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }


    }
    private int getDiffbetweenDates(String lastLoginDate) throws Exception{

        Date dt2 = new Date();
        Date dt1 = new Date(lastLoginDate);

        long diff = dt2.getTime() - dt1.getTime();
        long diffSeconds = diff / 1000 % 60;
        long diffMinutes = diff / (60 * 1000) % 60;
        long diffHours = diff / (60 * 60 * 1000);
        int diffInDays = (int) ((dt2.getTime() - dt1.getTime()) / (1000 * 60 * 60 * 24));

        return diffInDays;

    }
}
