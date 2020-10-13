const express = require("express");
const playmetaService = require("../../services/playmetaService");

const router = express.Router();

// Get Converted Result for Client
router.get("/:link", (req, res) => {
    const link = req.params.link;
    const resultjson = {};
    // SQL Select query
    playmetaService.findBanju(link)
        .then((content) => {
            if (content == null) {
                resultjson.status = "working";
                console.log("Conversion working.");
            } else if (content.status == "success") {
                resultjson.content = content;
                resultjson.status = "finished";
                console.log("Conversion finish.");
            } else {
                playmetaService.deleteBanju(req.params.link);
                resultjson.status = "Error";
                console.log("Conversion error");
            }
            res.send(resultjson);
        })
        // TODO: findBanju Service의 select 결과가 없으면 Error발생, 이외의 에러는?
        .catch(async (err) => {
            console.log("Never been requested");
            // TODO: musicreg Logic progress
            const sqsdata = await playmetaService.sendToSQS(link);

            resultjson.data = sqsdata;
            console.log('Music regist result: ', sqsdata);
            res.send(resultjson);
        });
});

// Save Data to DB, about Convereted Result from AI Model
router.post("/", (req, res) => {
    // status(success, error), message(Error Meesage) 추가?
    // status == error >> client error
    // content = 'Err'
    playmetaService.updateBanju(req.body.link, req.body.content)
        .then((update) => {
            console.log("number of row updated: ", update);
            // if update == 0, Means that no row has been updated
            if (update === 0) {
                console.log("POST /playmeta Failed. there are no updated rows");
                res.send({ message: "fail" });
            }
            // update success
            else {
                console.log("POST /playmeta Success");
                res.send({ message: "success" });
            }
        })
        // DB Update query Error Handling
        .catch((err) => {
            console.log("POST /playmeta Failed. update query error");
            res.send({ message: "Error", error: err });
        });
});

// Edit Banju content about user customizig banju
router.post("/edit", (req, res) => {
    playmetaService.editBanju(req.body.id, req.body.content)
        .then((data) => {
            res.send({ message: data });
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;
