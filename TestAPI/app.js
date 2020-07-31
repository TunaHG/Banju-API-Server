const express = require('express');
const bodyParser = require('body-parser');
// const request = require("request");
// const http = require("http");
const request = require('request-promise-native');
const youtube = require('./routes/youtube');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/youtube', youtube);

app.get('/', (req, res) => {
	// request("localhost:3000/youtube", (error, response, body) => {
	// 	if (!error && response.statusCode == 200) {
	// 		console.log(body);
	// 	}
	// });

	// http.get("http://localhost:3000/youtube", (res) => {
	// 	let data = "";
	// 	res.on("data", (chunk) => {
	// 		data += chunk;
	// 	});

	// 	res.on("end", () => {
	// 		let result = JSON.parse(data);
	// 		console.log(result);
	// 	});
	// }).on("error", (err) => {
	// 	console.log("Error is : " + err.message);
	// });

	// DynamoDB에서 해당 Link에 대한 값이 있는지 체크
	// 값이 없다면 새로운 항목을 생성, value는 특정 숫자로 지정
	// 변환이 완료되면 Model에서 직접적으로 value값을 변경
	// 해당 value값이 특정 숫자라면, Client에게 변환 진행중 전송
	// 해당 value값이 변환완료된 값이라면, Client에게 변환 완료 값 전송

	let option = {
		uri: 'http://localhost:3000/youtube',
		qs: {
			userID: req.query.userID,
			link: req.query.link
		}
	};

	let result;

	request(option)
		.then((body) => {
			result = body;
			console.log(body);
		})
		.catch((err) => {
			console.log(err);
		});

	res.send(result);
});

app.listen(port, () => {
	console.log('Test API Server is Running');
});
