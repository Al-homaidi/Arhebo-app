import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, ScrollView, RefreshControl, StatusBar, NativeSyntheticEvent, NativeScrollEvent, BackHandler } from 'react-native';
import WebView from 'react-native-webview';

import type { WebView as WebViewType } from 'react-native-webview';

const App = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [refresherEnabled, setEnableRefresher] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  const webViewRef = useRef<WebViewType | null>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const yOffset = Number(event.nativeEvent.contentOffset.y);
    console.log('WebView yOffset:', yOffset);

    if (yOffset <= 1) {
      console.log('Top of the page inside WebView');
      setEnableRefresher(true);
    } else {
      setEnableRefresher(false);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [canGoBack]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar backgroundColor="#007bff" barStyle="light-content" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        scrollEnabled={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            enabled={refresherEnabled}
            onRefresh={() => {
              webViewRef.current?.reload();
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 1000);
            }}
          />
        }
      >
        <WebView
          source={{ uri: 'https://fa22-2001-16a2-c038-5631-457a-b169-add4-7c98.ngrok-free.app/home' }}
          ref={webViewRef}
          originWhitelist={['*']}
          allowsInlineMediaPlayback
          javaScriptEnabled
          scalesPageToFit
          mediaPlaybackRequiresUserAction={false}
          useWebKit
          startInLoadingState={true}
          cacheEnabled
          onScroll={handleScroll}
          onLoadEnd={() => setRefreshing(false)}
          onNavigationStateChange={(navState) => setCanGoBack(navState.canGoBack)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
