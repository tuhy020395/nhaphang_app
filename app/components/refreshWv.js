import React, { useState } from 'react';
import WebView from 'react-native-webview';
import { RefreshControl, Dimensions, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  view: { flex: 1, height: '100%' }
});

const RefreshWebView =  React.forwardRef(({ isRefresh, onRefresh, ...webViewProps }, ref)  => {
  const [height, setHeight] = useState(Dimensions.get('screen').height);
  const [isEnabled, setEnabled] = useState(typeof onRefresh === 'function');
  return (
    <ScrollView
      onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
      refreshControl={
        <RefreshControl
          onRefresh={onRefresh}
          refreshing={isRefresh}
          enabled={isEnabled}
        />
      }
      style={styles.view}>
      <WebView
        {...webViewProps}
        ref={ref}
        onScroll={(e) =>
          setEnabled(
            typeof onRefresh === 'function' &&
              e.nativeEvent.contentOffset.y === 0
          )
        }
        style={[styles.view, { height }, webViewProps.style]}
      />
    </ScrollView>
  );
});

export default RefreshWebView;