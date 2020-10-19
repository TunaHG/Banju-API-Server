const express = require('express');
const config = require('../../config/config');
const axios = require('axios');
const searchService = require('../../services/searchService');
const playmetaService = require('../../services/playmetaService');

const router = express.Router();

// http://api.dailybanju.com/search/다이너마이트/date/
router.get('/:keyword', (req, res, next) => {
    const keyword = req.params.keyword;
    // order: date, rating, relevance, title, videoCount, viewCount (default: relevance)
    const order = req.query.order;
    // publishedAfter: datetime 1970-01-01T00:00:00Z
    const publishedAfter = req.query.publishedAfter;
    // videoDuration: any, long(>20m), medium(>4m, <20m), short(<4m)
    const videoDuration = req.query.videoDuration;
    const pageToken = req.query.pageToken;

    const option = {
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/search',
        params: {
            part: 'snippet',
            q: keyword,
            type: 'video',
            key: config.googleapikey,
            maxResults: '20',
            topicId: '/m/04rlf',
            regionCode: 'KR'
        }
    }

    if (order !== undefined) {
        option.params.order = order;
    }
    if (publishedAfter !== undefined) {
        const datetime = new Date();
        datetime.setDate(datetime.getDate() - publishedAfter);
        option.params.publishedAfter = datetime;
    }
    if (videoDuration !== undefined) {
        option.params.videoDuration = videoDuration;
    }
    if (typeof pageToken !== 'undefined') {
        option.params.pageToken = pageToken;
    }

    // if (pageToken !== undefined) {
    //     option.params.pageToken = pageToken;
    // }

    axios.request(option)
        .then(async ({ data }) => {
            console.log('first resolve()');
            const items = data.items;
            console.log(items.length);
            // searchService.getDataFromitems(items)
            //     .then((result) => {
            //         res.send(result);
            //     });

            let resultjson = {};
            let result = [];
            resultjson.nextPageToken = data.nextPageToken;
            for (const element of items) {
                let tmp = {};
                tmp.id = element.id.videoId;
                tmp.title = element.snippet.title;
                tmp.thumbnail = element.snippet.thumbnails.default;
                await playmetaService.findBanju(tmp.id)
                    .then((result) => {
                        // TODO: Banju의 Scale 추가
                        if (result === 0) {
                            tmp.convert = 'Need Banju';
                        }
                        else if (result === null) {
                            tmp.convert = 'Banjuing';
                        }
                        else {
                            tmp.convert = 'Banjued';
                        }
                    })
                    .catch((err) => {
                        console.log('findBanju Function error in search API');
                        console.log(err);
                    });
                const option = {
                    method: 'GET',
                    url: 'https://www.googleapis.com/youtube/v3/videos',
                    params: {
                        key: config.googleapikey,
                        id: tmp.id,
                        part: 'contentDetails'
                    }
                }
                await axios.request(option)
                    .then(({ data }) => {
                        const items = data.items;
                        tmp.duration = items[0].contentDetails.duration;
                    })
                    .catch((err) => {
                        console.log('video contentDetails api error')
                        console.log(err);
                        tmp.duration = 'PT0M00S';
                    })
                result.push(tmp);
            }
            resultjson.items = result;
            res.send(resultjson);
        })
        .catch(next);
})

module.exports = router;