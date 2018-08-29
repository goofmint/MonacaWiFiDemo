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
  WifiWizard2.getConnectedSSID(
    (ssid) => {
      $('#current_ssid').text(ssid);
    },
    (err) => {
      alert('getConnectedSSID Error:' + JSON.stringify(err));
    }
  );
};

// WiFiをスキャンしてドロップダウンを更新する
const scanWifi = () => {
  const select = $('#ssid select');
  // 既知のネットワーク情報を取得
  WifiWizard2.listNetworks(
    (ssids) => {
      select.empty();
      for (let ssid of ssids) {
        ssid = ssid.replace(/^"(.*)"$/, '$1');
        select.append(`<option value="${ssid}">${ssid}</option>`);
      }
    },
    (err) => {
      alert('listNetworks Error:' + JSON.stringify(err));
    }
  );
}

// WiFiの状態を調べてスイッチに反映
const checkWifiStatus = () => {
  WifiWizard2.isWifiEnabled(
    (status) => {
      $('#status').prop('checked', status);
    },
    (err) => {
      alert('isWifiEnabled Error:' + JSON.stringify(err));
    }
  );
}

// スイッチの状態をWiFi設定に反映
const setStatus = (e) => {
  WifiWizard2.setWifiEnabled(
    $("#status").prop('checked'),
    (result) => {
      alert(`Wifiを${$("#status").prop('checked') ? 'ON' : 'OFF'}にしました`);
    },
    (err) => {
      alert('setWifiEnabled Error:' + JSON.stringify(err));
    }
  );
}

// アクセスポイントを変更する処理
const changeAP = (e) => {
  const ssid = $('#ssid').val();
  if (ons.platform.isAndroid()) {
    WifiWizard2.androidConnectNetwork(
      ssid,
      (result) => {
        alert(result);
        getWiFiName();
      },
      (err) => {
        alert('androidConnectNetwork Error:' + JSON.stringify(err));
      }
    );
  } else {
    const password = $('#password').val();
    WifiWizard2.iOSConnectNetwork(
      ssid, 
      password,
      (result) => {
        alert(result);
        getWiFiName();
      },
      (err) => {
        alert('iOSConnectNetwork Error:' + JSON.stringify(err));
      }
    );
  }
}

document.addEventListener('deviceready', deviceready, false);
