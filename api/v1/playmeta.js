const express = require("express");
const playmetaService = require("../../services/playmetaService");
const Sentry = require('@sentry/node');

const router = express.Router();

/*
 * Create, Find banju data's status API
 * GET /playmeta/:link
 * if we don't have Banju data, Send Youtube link to AI Model and Convert to Banju
 * while Conversion, Send Progress status to Client
 * after Conversion finish, Send Banju data to Client
 * 
 * link: Youtube Link what you want to convert
 */
router.get("/:link", (req, res, next) => {
    const link = req.params.link;
    const resultjson = {};
    // TODO: AI Model에서 Error가 발생하여 Row는 남아있는데, Content는 업데이트가 안되는 상황 Handling
    // SQL Select query function
    playmetaService.findBanju(link)
        .then(async (content) => {
            if (content === null) {
                // TODO: null인 경우가 없지않나 이제?
                resultjson.status = "working";
                console.log("Conversion working.");
                res.status(200).send(resultjson);
            }
            // Select Query result have 0 row
            else if (content === 0) {
                resultjson.status = 'working';
                const sqsdata = await playmetaService.sendToSQS(link);

                resultjson.data = sqsdata.message;
                console.log('Music regist result: ', sqsdata);
                res.status(200).send(resultjson);
            }
            // Finish Conversion from AI Model
            else if (content.status === "success") {
                resultjson.content = content;
                resultjson.status = "finished";
                console.log("Conversion finish.");
                res.status(200).send(resultjson);
            }
            // Conversion Error from AI Model
            else if (content.status === 'error') {
                playmetaService.deleteBanju(req.params.link);
                resultjson.status = "error";
                console.log("Conversion error");
                Sentry.captureException(resultjson);
                res.status(200).send(resultjson);
            }
            // Conversion progress is working
            else {
                resultjson.status = 'working';
                resultjson.content = content;
                console.log(`Conversion working in ${content.progress}%`);
                // let standardTime = new Date();
                // if (content.startTime < new Date(standardTime.setMinutes(standardTime.getMinutes() - 2)){
                //     await playmetaService.sendToSQS(link);
                //     resultjson = {};
                //     resultjson.status = 'restart';
                // }
                res.status(200).send(resultjson);
            }
        })
        .catch(next);
});

// TODO: AI Model에서 Status를 넘겨줄 예정, Error아니면 정상
// Save Data to DB, about Convereted Result from AI Model
/**
 * POST /playmeta
 */
router.post("/", (req, res, next) => {
    playmetaService.updateBanju(req.body.link, req.body.content)
        .then((update) => {
            console.log("number of row updated: ", update);
            // if update == 0, Means that no row has been updated
            if (update === 0) {
                console.log("POST /playmeta Failed. there are no updated rows");
                res.status(200).send({ message: "update fail" });
            }
            // update success
            else {
                console.log("POST /playmeta Success");
                res.status(200).send({ message: "update success" });
            }
        })
        // DB Update query Error Handling
        .catch(next);
});

router.delete('/', (req, res, next) => {
    playmetaService.deleteBanju(req.body.link)
        .then((data) => {
            console.log('Banju Delete!');
            res.status(200).send({ message: 'delete success' });
        })
        .catch(next);
});

// TODO: Need update edit API (Error handling)
// Edit Banju content about user customizig banju
router.post("/edit", (req, res, next) => {
    playmetaService.editBanju(req.body.id, req.body.content)
        .then((data) => {
            res.status(200).send({ message: data });
        })
        .catch(next);
});

// TODO: Edit API (추후, AWS rambda로 보내서 결과를 받아야할 수 있음. -noteLeft, Right등 노트가 떨어지는 위치도 변경해줘야 하기 때문)

module.exports = router;
