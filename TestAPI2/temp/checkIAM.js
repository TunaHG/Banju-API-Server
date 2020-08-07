var AWS = require("aws-sdk");

// in WSL Ubuntu, using a symlink
// ln -s /mnt/c/Users/Tuna/.aws ~/.aws
// 이 과정을 진행해야 Ubuntu에서 Window에 저장한 Credentials 파일을 읽어올 수 있음
AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
  }
}); 