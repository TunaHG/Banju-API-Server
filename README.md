# :musical_keyboard: Banju
***AI기반 피아노 코드반주 학습 서비스***  
> Backend Develop Repository

**Software Maestro 11기 TEAM forte 🎼김성환 유인성 김하균**

![image](/uploads/90eafee2276cbd9aede0e5fbb496e626/image.png)

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
        - if youtube video is longer than 15 minutes, error occur
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
- `/search`
    - GET `/:keyword` : Get Search list from youtube data api
        - order, publishedAfter, videoDuration, pageToken available
        - order: date, rating, relevance, title, videoCoutn, viewCount
            - default: relevance
        - publishedAfter: some day before if you want to search
            - ex) 1, 3, 7, 30, ...etc
        - videoDuration: any, long(>20m), medium(>4m, <20m), short(<4m)
        - pageToken: nextPageToken
- `/popular`
    - GET `/` : Get list about popular music from youtube data api
- `/recommend`
    - GET `/:scale` : Get list about recommendation data based on the same scale
- `/api-docs`
    - API Docs

## 🔨 How to run  
### Using AWS Server
```bash
http://api.dailybanju.com/
```

### Docker Execution
```bash
$> docker pull asdf0185/forte_server:v1.0.16
$> docker run -p 80:3000 asdf0185/forte_server:v1.0.16
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
│       ├── playmeta.js     # Client's banju selection request, AI model's banju save request
│       ├── search.js       # Client's banju creation request
│       ├── popular.js      # Client's search popular music list request
│       ├── recommend.js    # Client's Recommend request
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
│       ├── Recommends.js   # Table of Recommend data
│       └── Follows.js      # Talbe of Follower, Following Relation
│   └── seeders
├── services                # Logic of api
│   ├── searchService.js    # search music function
│   ├── playmetaService.js  # find, update banju function
│   ├── popularService.js   # search popular music function
│   ├── recommendService.js # recommend another banju function
│   └── userService.js      # function about user CRUD
├── Dockerfile              # Dockerized project
├── README.md               # README file
├── .eslintrc.json          # ESLint Setting
├── .prettierrc.json        # Prettier Setting
├── .sequelizerc.json       # Sequelize Setting
├── .gitignore              # Git Ignore Setting
├── .dockerignore           # Docker Ignore Setting
├── swagger.yaml            # api-docs Setting
├── package.json
├── package-lock.json
└── app.js
```
