# :musical_keyboard: Banju
***AI기반 피아노 코드반주 학습 서비스***  
> Backend Develop Repository

**Software Maestro 11기 TEAM forte 🎼김성환 유인성 김하균**

## 🔎 Features in Backend Server
- Client's Banju data creation request
- Client's Banju data get from db request
- AI model's Banju data save to db request

## 🔨 How to run  
### Docker Execution
```bash
$> docker pull asdf0185/forte_server:v1.2
$> docker run -p 3000:3000 asdf0185/forte_server:v1.2
```  

### Native Execution  
**Preparing Enviroment**
AWS Credentials Setting
```bash
$> sudo vim ~/.aws/credentials
$> ln -s ~/.aws/credentials /mnt/c/Users/{Username}/.aws
```

Credentials file
```bash
[default]
aws_access_key_id = {AWS ACCESS KEY}
aws_secret_access_key = {AWS SECRET ACCESS KEY}
```

**Run**
```bash
$> npm install
$> npm start (or node app.js)
```  

## 📁 Directory Structure
```bash
.
├── api  # API folder
│   └── v1  # version 1
│       ├── musicreg.js  # Client's banju creation request
│       └── playmeta.js  # Client's banju selection request, AI model's banju save request
├── config  # Configuration folder
│   └── config.js  # configuration with dotenv
├── models  # Database models folder
│   ├── index.js  # export all models
│   ├── Banjus.js  # Table of Chord Sheetmusic data
│   ├── Practices.js  # Table of user's practice data
│   └── Users.js  # Table of user data
├── services  # Logic of api
│   ├── musicregService.js  # music registration function
│   └── playmetaService.js  # find, update banju function
├── Dockerfile  # Dockerized project
├── README.md  # README file
├── package.json
├── package-lock.json
└── app.js
```
