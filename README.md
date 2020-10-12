# :musical_keyboard: Banju
***AI기반 피아노 코드반주 학습 서비스***  
> Backend Develop Repository

**Software Maestro 11기 TEAM forte 🎼김성환 유인성 김하균**

## 🔎 Features in Backend Server
- Client's Banju data creation request
- Client's Banju data get from db request
- AI model's Banju data save to db request

## API Reference
- `/musicreg`
    - POST `/` : Client requests AI Model to convert to banju data(JSON Convention)
        - The 'link' must be included in the body.
        - 'link' is a hash value representing a video in Youtube URL
        ex) '2qtKMC5wzkU' in 'https://www.youtube.com/watch?v=2qtKMC5wzkU'
- `/playmeta`
    - GET `/:link` : Request Banju data for the youtube link given as params
    - POST `/` : Request to save the banju data by AI Model
        - 'link' and 'content' must be included in the body
        - {"link" : "hash of youtube", "content" : .banju}
- `/user`
    - POST `/` : Get JSON about Check our member or not
        - type, accesstoken must be included in the body
        - type : kakao, google, apple
        - accesstoken : platform's accesstoken (but, apple is authorization code)
    - POST `/join` : if user is not our member, join user in our service
    - GET `/me/:id` : Get UserInfo from our service

## 🔨 How to run  
### Docker Execution
```bash
$> docker pull asdf0185/forte_server:v2.0
$> docker run -p 3000:3000 asdf0185/forte_server:v
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
│       └── user.js  # Client's Login, Join, etc API
├── config  # Configuration folder
│   ├── config.js  # configuration with dotenv
│   ├── database.js  # Database Configuration
│   └── passport.js  # JWT configuration with passport
├── db
│   ├── migrations  # Sequelize migration folder
│   ├── models  # Database models folder
│       ├── index.js  # export all models
│       ├── Banjus.js  # Table of Chord Sheetmusic data
│       ├── Practices.js  # Table of user's practice data
│       ├── Users.js  # Table of user data
│       ├── Posts.js  # Table of User's Post data
│       ├── Comments.js  # Table of User's Comment data
│       └── Follows.js  # Talbe of Follower, Following Relation
│   └── seeders
├── services  # Logic of api
│   ├── musicregService.js  # music registration function
│   ├── playmetaService.js  # find, update banju function
│   └── userService.js  # function about user CRUD
├── Dockerfile  # Dockerized project
├── README.md  # README file
├── package.json
├── package-lock.json
└── app.js
```
