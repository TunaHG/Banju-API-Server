const express = require('express');
const { find, update } = require('../../services/playmetaService');

const router = express.Router();

// TODO: content에 Error가 있을경우 Client에게 Error return하고 DB row 삭제
// Get Converted Result for Client
router.get('/:link', (req, res) => {
    let resultjson = {};
    // SQL Select query
    find(req.params.link)
    .then((content) => {
        if(content == null) {
            resultjson.status = "working";
            console.log("Conversion working.");
        } else {
            resultjson.content = content;
            resultjson.status = "finished";
            console.log("Conversion finish.");
        }
        res.send(resultjson);
    })
    // Error Handling
    .catch((err) => {
        resultjson.status = "error"
        console.log("Never been requested");
        res.send(resultjson);
    });
});

// TODO: AI Model에서 Status를 넘겨줄 예정, Error아니면 정상
// Save Data to DB, about Convereted Result from AI Model
router.post('/', (req, res) => {
    update(req.body.link, req.body.content)
    .then((update) => {
        console.log("number of row updated: ", update);
        // if update == 0, Means that no row has been updated
        if(update === 0){
            console.log("POST /playmeta Failed. there are no updated rows");
            res.send(JSON.parse('{"msg":"fail"}'));
        }
        // update success
        console.log("POST /playmeta Success");
        res.send(JSON.parse('{"msg":"success"}'));
    })
    // DB Update query Error Handling
    .catch((err) => {
        console.log("POST /playmeta Failed. update query error");
        res.send(JSON.parse('{"msg":"Error"}'));
    });
});

// TODO: Edit API (추후, AWS rambda로 보내서 결과를 받아야할 수 있음. -noteLeft, Right등 노트가 떨어지는 위치도 변경해줘야 하기 때문)

module.exports = router;