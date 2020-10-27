const express = require("express");
const playmetaService = require("../../services/playmetaService");
const searchService = require('../../services/searchService');
const Sentry = require('@sentry/node');
const passport = require('passport');

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
router.get("/:link", passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const link = req.params.link;
    const resultjson = {};
    // SQL Select query function
    playmetaService.findBanjuByLink(link)
        .then((content) => {
            // first request about link.
            if (content === null) {
                searchService.getDuration(link)
                    .then(async (videoDuration) => {
                        const checkHour = videoDuration.indexOf('H');
                        const minute = videoDuration.match(/\d+(?=M)/);
                        if (checkHour === -1 && minute < 15) {
                            resultjson.status = 'working';
                            const sqsdata = await playmetaService.sendToSQS(link);

                            resultjson.data = sqsdata.message;
                            console.log('Music regist result: ', sqsdata);
                        } else {
                            resultjson.status = 'error';
                            resultjson.content = { message: 'videoDuration must be 15 or less' };
                            console.log('Error with videoDuration of 15 or more');
                        }
                        res.status(200).send(resultjson);
                    })
                    .catch(next);
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
                let standardTime = new Date();
                if (content.startTime < new Date(standardTime.setMinutes(standardTime.getMinutes() - 2))) {
                    const sqsdata = await playmetaService.sendToSQS(link);
                    resultjson = {};
                    resultjson.status = 'restart';
                    resultjson.data = sqsdata.message;
                }
                res.status(200).send(resultjson);
            }
        })
        .catch(next);
});

// Save Data to DB, about Convereted Result from AI Model
/**
 * POST /playmeta
 */
router.post("/", (req, res, next) => {
    playmetaService.updateBanju(req.body.link, req.body.content)
        .then((update) => {
            console.log("number of row updated: ", update);
            // if update == 0, Means that no row has been updated
            if (update[0] === 0) {
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
        .then(() => {
            console.log('Banju Delete!');
            res.status(200).send({ message: 'delete success' });
        })
        .catch(next);
});

// Edit Banju content about user customizig banju
router.post("/edit", passport.authenticate('jwt', { session: false }), (req, res, next) => {
    playmetaService.editBanju(req.body.id, req.body.content)
        .then((data) => {
            console.log('edit banju api is working');
            res.status(200).send({ message: data });
        })
        .catch(next);
});

router.get('/shared/:banjuId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const banjuId = req.params.banjuId;
    playmetaService.findBanjuById(banjuId)
        .then((content) => {
            console.log('shared banju using id api is working');
            res.status(200).send(content);
        })
        .catch(next);
});

router.get('/original/:banjuId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const banjuId = req.params.banjuId;
    playmetaService.findOriginalBanju(banjuId)
        .then((data) => {
            console.log('find original banju api is working');
            res.status(200).send(data);
        })
        .catch(next);
});

module.exports = router;
