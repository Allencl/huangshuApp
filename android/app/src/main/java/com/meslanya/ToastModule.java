// ToastModule.java

package com.meslanya;


import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;

import java.util.Map;
import java.util.HashMap;
import android.util.Log;


import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;


public class ToastModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";

  public ToastModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName() {
    return "ToastExample";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
    constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
    return constants;
  }

  @ReactMethod
  public void show(String message) {
    Toast.makeText(getReactApplicationContext(),message,Toast.LENGTH_LONG).show();
  }



  private List<String> jsonToObject(String data) {
    List<String> list = new ArrayList<>();
    try {
        JSONArray array = new JSONArray(data);
        for (int i = 0; i < array.length(); i++) {
            list.add(array.getString(i));
        }
    } catch (JSONException e) {

    }

    return list;
  }

  @ReactMethod
  public void bluetooth(String dress, String images) {
    MainApplication application = (MainApplication) reactContext.getApplicationContext();
    

    List<String> list = jsonToObject(images);
    if (list.size() > 0) {
      application.updateImage(dress,jsonToObject(images));
    }

  }

}