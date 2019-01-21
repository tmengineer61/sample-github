importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

// プリキャッシュしたファイルを変更した場合には、以下のバージョンも変更する
const SUFFIX = 'v1';

// Cache する方法
const CACHE_NAME = 'pracice'+SUFFIX;

if (workbox) {

    // images配下の画像キャッシュ
    // Cacheするリソースの期限を決める
    // workbox.routing: パスがリクエストと一致判定、レスポンス応答処理を定義するオブジェクト
    // serviceworkerのキャッシュするファイルを設定する
    workbox.routing.registerRoute(
        // どのパスが来た場合に、レスポンス応答を行うか定義する
        new RegExp('images/'),
        workbox.strategies.networkFirst({
            cacheName: 'image-cache-' + SUFFIX,
            // Pluginを使用する場合は、インスタンスを生成する
            plugins: [
                        new workbox.expiration.Plugin({
                            // expires:30日
                            maxAgeSeconds: 30 * 24 * 60 * 60,
                            // 最大登録個数：50個
                            maxEntries: 50
                        }),
            ]
        })
    );

    // JSファイルキャッシュ
    // ファイルによって、キャッシュする期限を設定することができる
    workbox.routing.registerRoute(
        // どのパスが来た場合に、レスポンス応答を行うか定義する
        new RegExp('js/'),
        workbox.strategies.networkFirst({
            cacheName: 'js-cache-' + SUFFIX,
            // Pluginを使用する場合は、インスタンスを生成する
            plugins: [
                        new workbox.expiration.Plugin({
                            // expires:30日
                            maxAgeSeconds: 30 * 24 * 60 * 60,
                            // 最大登録個数：50個
                            maxEntries: 50
                        }),
            ]
        })
    );

    // CSSファイルキャッシュ
    // ファイルによって、キャッシュする期限を設定することができる
    workbox.routing.registerRoute(
        // どのパスが来た場合に、レスポンス応答を行うか定義する
        new RegExp('css/'),
        workbox.strategies.networkFirst({
            cacheName: 'css-cache-' + SUFFIX,
            // Pluginを使用する場合は、インスタンスを生成する
            plugins: [
                        new workbox.expiration.Plugin({
                            // expires:30日
                            maxAgeSeconds: 30 * 24 * 60 * 60,
                            // 最大登録個数：50個
                            maxEntries: 50
                        }),
            ]
        })
    );

    // ページキャッシュ
    //キャッシュされている場合は、キャッシュコンテンツ返却
    workbox.routing.registerRoute(
        // どのパスが来た場合に、レスポンス応答を行うか定義する
        new RegExp('html'),
        workbox.strategies.networkFirst({
            cacheName: 'page-cache-' + SUFFIX,
        })
    );

    // オフラインGoogleAnalyticsを有効にする
    workbox.googleAnalytics.initialize({
        parameterOverrides:{
            cd1: 'offline',
        },
    });
}

// installイベント event:installイベントオブジェクト
self.addEventListener('install', function(event) {
    // serviceWorkerがinstallされるまで待つ関数
    event.waitUntil(
        // caches=cache Storage?? cacheオブジェクトと接続するために、cachestorageを開く
        caches.open(CACHE_NAME)
        .then(function(cache) {
            // cacheに保存したいデータを保存する
            // BASIC認証がかかっている環境では、credentialsを含むようにしたいため、
            // 新しくリクエストを作成し、credentialsを含むようにする
            cache.addAll(cacheSource.map(function(currentValue) {
                return new Request(currentValue, {credentials:'same-origin'});
            // cache.addAll成功時関数
            })).then(function() {
                // Debug 
            })
            // cache.addAll失敗時関数
            .catch(function(error) {
            });
        })
        // caches.open失敗時関数
        .catch(function(error) {
        })
    );
    self.skipWaiting();
});

// fetchイベント event:fetchイベントオブジェクト
self.addEventListener('fetch', function(event) {
});

// activateイベント event:activateイベントオブジェクト
self.addEventListener('activate', function(event) {
  // 非同期のpromiseが重なった場合でも、順番良く実行できるまで待つ
  event.waitUntil(
    // cache内のキー(値)を返却する
    // keys(request)とすると、requestのキー(単一？)が取得できる,keys():全てのcache
    caches.keys()
      .then(function(keyList) {
        // Promise.all:非同期で行われた結果を全て取得する
        // .map(function(key)): 配列の値を順番に取得する
        return Promise.all(keyList.map(function(key) {
          var keySuffix = key.slice(-2);
          // cache名が変更されていたら
          if (keySuffix !== SUFFIX) {
            // cacheStorageを削除する
            return caches.delete(key);
          }
        }));
      })
  );
  // activate状態からすぐにブラウザをコントロールする命令
  return self.clients.claim();
});


