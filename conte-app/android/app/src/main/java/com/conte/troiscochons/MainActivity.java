package com.conte.troiscochons;

import android.app.Activity;
import android.os.Build;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import java.util.HashMap;
import java.util.Locale;

public class MainActivity extends Activity {
    private WebView web;
    private TextToSpeech tts;
    private boolean ttsReady = false;

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        web.addJavascriptInterface(new Bridge(), "Android");
        setContentView(web);
        hideUi();

        tts = new TextToSpeech(this, status -> {
            if (status == TextToSpeech.SUCCESS) {
                int r = tts.setLanguage(Locale.FRANCE);
                if (r < 0) tts.setLanguage(Locale.FRENCH);
                tts.setPitch(1.7f);       // voix aiguë "dessin animé"
                tts.setSpeechRate(1.05f);
                ttsReady = true;
            }
            runOnUiThread(() -> web.loadUrl("file:///android_asset/index.html"));
        });
        tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
            @Override public void onStart(String id) {}
            @Override public void onDone(String id) { done(id); }
            @Override public void onError(String id) { done(id); }
        });
    }

    private void done(final String id) {
        runOnUiThread(() -> web.evaluateJavascript("window.__ttsDone && window.__ttsDone('" + id + "')", null));
    }

    private void hideUi() {
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
    }

    @Override public void onWindowFocusChanged(boolean f) { super.onWindowFocusChanged(f); if (f) hideUi(); }

    @Override protected void onDestroy() { if (tts != null) tts.shutdown(); super.onDestroy(); }

    class Bridge {
        @JavascriptInterface
        public void speak(String text, String id, float pitch) {
            if (!ttsReady) { done(id); return; }
            tts.setPitch(pitch);
            if (Build.VERSION.SDK_INT >= 21) {
                Bundle p = new Bundle();
                tts.speak(text, TextToSpeech.QUEUE_ADD, p, id);
            } else {
                HashMap<String, String> p = new HashMap<>();
                p.put(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, id);
                tts.speak(text, TextToSpeech.QUEUE_ADD, p);
            }
        }
    }
}
