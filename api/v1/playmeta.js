const express = require('express');
const { find, update } = require('../../services/playmetaService');

const router = express.Router();

// Get Converted Result for Client
router.get('/:link', (req, res) => {
    let resultjson = {};
    find(req.params.link).then((content) => {
        if(content == null) {
            resultjson.status = "working";
            console.log("Conversion working.");
        } else {
            resultjson.content = content;
            resultjson.status = "finished";
            console.log("Conversion finish. result: ", resultjson);
        }
    }).catch((err) => {
        resultjson.status = "error"
        console.log("Never been requested. Error: ", err);
    });
    res.send(resultjson);
});

// Save Data to DB, about Convereted Result from AI Model
router.post('/', (req, res) => {
    // if(req.body.err)
    update(req.body.link, req.body.content);
    console.log("Update Success in /playmeta POST");
    res.send(JSON.parse('{"msg":"success"}'));
});
// Update Result with CLient's participation
//router.put();
// Delete Result What Client want to delete
//router.delete();

module.exports = router;