$(function() {
    // オプション・オブジェクト
    var optionObj = {
        "enableHighAccuracy": false ,
        "timeout": 8000 ,
        "maximumAge": 5000 ,
    } ;

    // 成功した時の関数
    function successFunc( position )
    {
        // 緯度をアラート表示
        alert( position.coords.latitude ) ;

        // 経度をアラート表示
        alert( position.coords.longitude ) ;
    }

    // 失敗した時の関数
    function errorFunc( error )
    {
        // エラーコードのメッセージを定義
        var errorMessage = {
            0: "原因不明のエラーが発生しました…。" ,
            1: "位置情報の取得が許可されませんでした…。" ,
            2: "電波状況などで位置情報が取得できませんでした…。" ,
            3: "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。" ,
        } ;

        // エラーコードに合わせたエラー内容をアラート表示
        alert( errorMessage[error.code] ) ;
    }

    // Geolocation APIに対応している
    if( navigator.geolocation )
    {
        // 現在位置を取得できる場合の処理
        // 現在地を取得
        navigator.geolocation.getCurrentPosition(successFunc, errorFunc, optionObj);
    }

    // Geolocation APIに対応していない
    else
    {
        // 現在位置を取得できない場合の処理
        alert( "あなたの端末では、現在位置を取得できません。" ) ;
    }
});
