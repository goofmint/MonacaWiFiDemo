// This is a JavaScript file

const deviceready = () => {
  // WiFiのステータスをチェック
  checkWifiStatus();
  
  // 現在繋がっているWiFiをチェック
  getWiFiName();
  
  // 存在するSSIDをチェック
  scanWifi();
  
  // Androidであればパスワード入力は無効にする
  if (ons.platform.isAndroid()) {
    $('#password').prop('disabled', true);
  }
};

// 現在接続中のWiFiネットワークを取得
const getWiFiName = () => {
  WifiWizard2.getCurrentSSID(
    ssid => $('#current_ssid').text(ssid),
    err => alert(JSON.stringify(err))
  );
};

// WiFiをスキャンしてドロップダウンを更新する
const scanWifi = () => {
  const select = $('#ssid select');
  scanWifiAsync()
    .then((ssids) => {
      select.empty();
      for (let ssid of ssids) {
        ssid = ssid.replace(/^"(.*)"$/, '$1');
        select.append(`<option value="${ssid}">${ssid}</option>`);
      }
    }, (err) => alert(JSON.stringify(err))
  );
}

// 既知のネットワーク情報とスキャンしたWiFi情報を合わせて返す
const scanWifiAsync = () => {
  let results = [];
  return new Promise((res, rej) => {
    // 既知のネットワーク情報を取得
    WifiWizard2.listNetworks(
      ssids => {
        results = ssids;
        // 周囲のAPを調べる
        WifiWizard2.startScanAsync();
        // 調べた結果を取得
        WifiWizard2.getScanResults(
          ssids => res(results.concat(ssids)),
          err => rej(err)
        );
      },
      (err) => rej(err)
    );
  });
}

// WiFiの状態を調べてスイッチに反映
const checkWifiStatus = () => {
  WifiWizard2.isWifiEnabled(
    (status) => {
      $('#status').prop('checked', status)
    },
    (err) => {}
  );
}

// スイッチの状態をWiFi設定に反映
const setStatus = (e) => {
  WifiWizard2.setWifiEnabledAsync($("#status").prop('checked'));
}

// アクセスポイントを変更する処理
const changeAP = (e) => {
  const ssid = $('#ssid').val();
  if (ons.platform.isAndroid()) {
    WifiWizard2.androidConnectNetwork(ssid,
      (status) => alert('接続しました'),
      (err) => alert(JSON.stringify(err))
    );
  } else {
    const password = $('#password').val();
    WifiWizard2.iOSConnectNetwork(ssid, password,
      (status) => alert('接続しました'),
      (err) => alert(JSON.stringify(err))
    );
  }
}

document.addEventListener('deviceready', deviceready, false);
