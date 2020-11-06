const express = require('express');
const config = require('../../config/config');
const searchService = require('../../services/searchService');
const passport = require('passport');

const router = express.Router();

// http://api.dailybanju.com/search/다이너마이트
router.get('/:keyword', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const keyword = req.params.keyword;
    // // order: date, rating, relevance, title, videoCount, viewCount (default: relevance)
    // const order = req.query.order;
    // // publishedAfter: datetime 1970-01-01T00:00:00Z
    // const publishedAfter = req.query.publishedAfter;
    // // videoDuration: any, long(>20m), medium(>4m, <20m), short(<4m)
    // const videoDuration = req.query.videoDuration;
    // const pageToken = req.query.pageToken;

    searchService.tempSearchDatas(keyword)
        .then((result) => {
            console.log('Success data search in Temp API');
            res.status(200).send(result);
        })
        .catch(next);

    // const option = {
    //     method: 'GET',
    //     url: 'https://www.googleapis.com/youtube/v3/search',
    //     params: {
    //         part: 'snippet',
    //         q: keyword,
    //         type: 'video',
    //         key: config.googleapikey,
    //         maxResults: '50',
    //         topicId: '/m/04rlf',
    //         regionCode: 'KR'
    //     }
    // }

    // if (order !== undefined) {
    //     option.params.order = order;
    // }
    // if (publishedAfter !== undefined) {
    //     const datetime = new Date();
    //     datetime.setDate(datetime.getDate() - publishedAfter);
    //     option.params.publishedAfter = datetime;
    // }
    // if (videoDuration !== undefined) {
    //     option.params.videoDuration = videoDuration;
    // }
    // if (typeof pageToken !== 'undefined') {
    //     option.params.pageToken = pageToken;
    // }

    // searchService.searchDatas(option)
    //     .then((result) => {
    //         console.log('Success data search');
    //         res.status(200).send(result);
    //     })
    //     .catch(next);
});

router.get('/test/:keyword', (req, res, next) => {
    const keyword = req.params.keyword;

    searchService.tempSearchDatas(keyword)
        .then((result) => {
            console.log('Success data search in Temp API');
            res.status(200).send(result);
        })
        .catch(next);
});

module.exports = router;