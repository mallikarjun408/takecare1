package com.caresuper.mobile.app;

import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.os.Handler;
import android.support.v4.app.NotificationCompat;
import android.util.Base64;
import android.webkit.JavascriptInterface;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.util.Date;

public class JavaScriptInterface {
    private Context context;
    private NotificationManager nm;
    public JavaScriptInterface(Context context) {
        this.context = context;
    }

    @JavascriptInterface
    public void getBase64FromBlobData(String base64Data) throws IOException {
        convertBase64StringToPdfAndStoreIt(base64Data);
    }
    public static String getBase64StringFromBlobUrl(String blobUrl){
        if(blobUrl.startsWith("blob")){
            return "javascript: var xhr = new XMLHttpRequest();" +
                    "xhr.open('GET', '"+blobUrl+"', true);" +
                    "xhr.setRequestHeader('Content-type','application/pdf');" +
                    "xhr.responseType = 'blob';" +
                    "xhr.onload = function(e) {" +
                    "    if (this.status == 200) {" +
                    "        var blobPdf = this.response;" +
                    "        var reader = new FileReader();" +
                    "        reader.readAsDataURL(blobPdf);" +
                    "        reader.onloadend = function() {" +
                    "            base64data = reader.result;" +
                    "            Android.getBase64FromBlobData(base64data);" +
                    "        }" +
                    "    }" +
                    "};" +
                    "xhr.send();";
        }
        return "javascript: console.log('It is not a Blob URL');";
    }
    private void convertBase64StringToPdfAndStoreIt(String base64PDf) throws IOException {
        final int notificationId = 1;
        String currentDateTime = DateFormat.getDateTimeInstance().format(new Date());
        final File dwldsPath = new File(Environment.getExternalStoragePublicDirectory(
                Environment.DIRECTORY_DOWNLOADS) + "/investment-" + currentDateTime + "_.pdf");
        byte[] pdfAsBytes = Base64.decode(base64PDf.replaceFirst("^data:application/pdf;base64,", ""), 0);
        FileOutputStream os;
        os = new FileOutputStream(dwldsPath, false);
        os.write(pdfAsBytes);
        os.flush();



      /*  if(dwldsPath.exists()) {
            NotificationCompat.Builder b = new NotificationCompat.Builder(context, "MY_DL")
                    .setDefaults(NotificationCompat.DEFAULT_ALL)
                    .setWhen(System.currentTimeMillis())
                    .setSmallIcon(R.drawable.ic_file_download_24dp)
                    .setContentTitle("CareSuper")
                    .setContentText("investment");
            nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if(nm != null) {
                nm.notify(notificationId, b.build());
                Handler h = new Handler();
                long delayInMilliseconds = 5000;
                h.postDelayed(new Runnable() {
                    public void run() {
                        nm.cancel(notificationId);
                    }
                }, delayInMilliseconds);
            }
        } */


      //  File file = new File(Environment.getExternalStorageDirectory().getAbsolutePath()+"/example.pdf");
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(Uri.fromFile(dwldsPath), "application/pdf");
        intent.setFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
        context.startActivity(intent);
    }
}