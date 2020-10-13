const express = require('express');
const passport = require('passport');
const axios = require('axios');
const config = require('../../config/config');
const userService = require('../../services/userService');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const AppleAuth = require('apple-auth');

const router = express.Router();

/*
 * Check member API
 * get userInfo from social login(kakao, google, apple) using accesstoken from frontend
 * check our database using user's email
 * return status of user's join status
 *
 * Type : kakao, google, apple
 * accessToken : Each type's Login Authenticate accesstoken
 *
 * TODO: Type분기를 Service의 function으로 변경
 */
router.post('/', async (req, res) => {
	const type = req.body.type;
	const author = 'Bearer ' + req.body.accessToken;

	// // Using accesstoken from kakao
	// if(type == 'kakao'){
	//     const option = {
	//         method: 'POST',
	//         url: 'https://kapi.kakao.com/v2/user/me',
	//         headers: {
	//             Authorization: author
	//         }
	//     };

	//     axios.request(option)
	//     .then(({data}) => {
	//         const kakaoInfo = data.kakao_account;
	//         userService.checkJoined(kakaoInfo.email)
	//         .then((userId) => {
	//             if(userId == 0) {
	//                 res.send({message: 'not user'});
	//             }
	//             else if(userId == 'Err') {
	//                 throw Error();
	//             }
	//             else {
	//                 const token = jwt.sign({id: userId}, config.jwtsecret);
	//                 res.send({message: 'already user', token});
	//             }
	//         })
	//         .catch((err) => {
	//             console.log('CheckJoined Error in kakaologin func');
	//             console.log(err);
	//             res.send({message: 'checkJoinedError'});
	//         });
	//     })
	//     .catch((err) => {
	//         console.log('Axios request Error in kakaologin func');
	//         console.log(err);
	//         res.send({message: 'AxiosrequestError'});
	//     })
	// }
	// // Using accesstoken from google
	// else if(type == 'google') {
	//     const option = {
	//         method: 'GET',
	//         url: 'https://www.googleapis.com/oauth2/v1/userinfo',
	//         headers: {
	//             Authorization: author
	//         },
	//         params: {
	//             alt: 'json'
	//         }
	//     };

	//     axios.request(option)
	//     .then(({data}) => {
	//         userService.checkJoined(data.email)
	//         .then((userId) => {
	//             if(userId == 0) {
	//                 console.log('not user');
	//                 res.send({message: 'not user'});
	//             }
	//             else if(userId == 'Err') {
	//                 throw Error();
	//             }
	//             else {
	//                 console.log('already user');
	//                 const token = jwt.sign({id: userId}, config.jwtsecret);
	//                 res.send({message: 'already user', token});
	//             }
	//         })
	//         .catch((err) => {
	//             console.log('CheckJoined Error in googlelogin func');
	//             console.log(err);
	//             res.send({message: 'checkJoinedError'});
	//         });
	//     })
	//     .catch((err) => {
	//         console.log('Axios request error in googlelogin func');
	//         console.log(err);
	//         res.send({message: 'AxiosrequestError'});
	//     });
	// }
	// // Using accesstoken from apple
	// else if(type == 'apple') {
	//     // GET https://appleid.apple.com/auth/keys
	//     // value e decode Base64

	//     // apple-auth를 통한 이메일 추출
	//     let { code } = req.body;
	//     if (!code) {
	//         res.status(200).json(NULL_VALUE);
	//         return;
	//     }
	//     const response  = await auth.accessToken(code);
	//     const idToken = jwt.decode(response.id_token);
	//     const email = idToken.email;
	//     console.log(email);

	//     userService.checkJoined(email)
	//         .then((userId) => {
	//             if(userId == 0) {
	//                 console.log('not user');
	//                 res.send({message: 'not user'});
	//             }
	//             else if(userId == 'Err') {
	//                 throw Error();
	//             }
	//             else {
	//                 console.log('already user');
	//                 const token = jwt.sign({id: userId}, config.jwtsecret);
	//                 res.send({message: 'already user', token});
	//             }
	//         })
	//         .catch((err) => {
	//             console.log('CheckJoined Error in googlelogin func');
	//             console.log(err);
	//             res.send({message: 'checkJoinedError'});
	//         });
	// }

	let result = 'aa';
	if (kakao) {
		// resolve안에 넣은 값이 return됨
		result = await userService.kakaologin(author);
	}

	console.log(result);
	res.send(result);
});

/*
 * Join API
 * Join our service with data (email, name)
 */
router.post('/join', (req, res) => {
	userService
		.joinUser(req.body.email, req.body.nickname)
		.then((result) => {
			if (result != 'JoinError') {
				const token = jwt.sign({ id: result }, config.jwtsecret);
				return res.send({ message: 'Success', token });
			} else {
				return res.send({ message: 'Error' });
			}
		})
		.catch((err) => {
			console.log('Error in Join');
			return res.send({ message: 'Error' });
		});
});

/*
 * Get UserInfo API
 * get user data
 * name, email, banju, practice, ... etc
 *
 * TODO: 세션으로 넘어오는 JWT decode해서 사용
 */
router.get('/me/:id', (req, res) => {
	userService
		.getUserInfo(req.params.id)
		.then((result) => {
			return res.send({ status: 'Success', data: result });
		})
		.catch((err) => {
			console.log('Error in /user/me API');
			return res.send({ status: 'Error' });
		});
});

module.exports = router;
