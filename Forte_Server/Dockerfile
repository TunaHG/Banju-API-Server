FROM node:12

# 앱 디렉터리 생성
WORKDIR /usr/src/app

# 앱 의존성 설치
# 가능한 경우(npm@5+) package.json과 package-lock.json을 모두 복사하기 위해
# 와일드카드를 사용
COPY package*.json ./

RUN npm install
# 프로덕션을 위한 코드를 빌드하는 경우
# RUN npm ci --only=production

# Err 발생할 경우 EAI_AGAIN, reposit.npmjs.org
# sudo vim /etc/resolv.conf
# nameserver 8.8.8.8
# nameserver 8.8.4.4
# 이후 재부팅해서 진행
# ping 8.8.8.8과 ping google.com 둘다 확인해보고 이상없으면 진행

# 앱 소스 추가
COPY . .

EXPOSE 3000
CMD [ "node", "app.js" ]
