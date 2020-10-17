# :musical_keyboard: Banju
***AI기반 피아노 코드반주 학습 서비스***  
> Backend Develop Repository

**Software Maestro 11기 TEAM forte 🎼김성환 유인성 김하균**

## 🔎 Features in Backend Server
- Client's Banju data creation request
- Client's Banju data get from db request
- AI model's Banju data save to db request
- Client's Music searching request using youtube data api

## API Reference        
- `/playmeta`
    - GET `/:link` : Request Banju data for the youtube link given as params
        - if Banju data does not exist, Request data generation to AI Model
        - link means youtube videoId
            - ex) 'videoId' in 'https://www.youtube.com/watch?v={videoId}'
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
### Using AWS Server
```bash
http://api.dailybanju.com/
```

### Docker Execution
```bash
$> docker pull asdf0185/forte_server:v2.2
$> docker run -p 3000:3000 asdf0185/forte_server:v2.2
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
├── api                     # API folder
│   └── v1                  # version 1
│       ├── search.js       # Client's banju creation request
│       └── playmeta.js     # Client's banju selection request, AI model's banju save request
│       └── user.js         # Client's Login, Join, etc API
├── config                  # Configuration folder
│   ├── config.js           # configuration with dotenv
│   ├── database.js         # Database Configuration
│   └── passport.js         # JWT configuration with passport
├── db
│   ├── migrations          # Sequelize migration folder
│   ├── models              # Database models folder
│       ├── index.js        # export all models
│       ├── Banjus.js       # Table of Chord Sheetmusic data
│       ├── Practices.js    # Table of user's practice data
│       ├── Users.js        # Table of user data
│       ├── Posts.js        # Table of User's Post data
│       ├── Comments.js     # Table of User's Comment data
│       └── Follows.js      # Talbe of Follower, Following Relation
│   └── seeders
├── services                # Logic of api
│   ├── searchService.js    # search music function
│   ├── playmetaService.js  # find, update banju function
│   └── userService.js      # function about user CRUD
├── Dockerfile              # Dockerized project
├── README.md               # README file
├── .eslintrc.json          # ESLint Setting
├── .prettierrc.json        # Prettier Setting
├── package.json
├── package-lock.json
└── app.js
```
