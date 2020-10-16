const express = require('express');
const config = require('../../config/config');
const axios = require('axios');
const searchService = require('../../services/searchService');

const router = express.Router();

router.get('/:keyword', (req, res) => {
    const keyword = req.params.keyword;

    const option = {
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/search',
        params: {
            part: 'snippet',
            q: keyword,
            type: 'video',
            key: config.googleapikey,
            maxResults: '5',
            order: 'relevance',
            topicId: '/m/04rlf'
        }
    }

    axios.request(option)
        .then(async ({ data }) => {
            console.log('first resolve()');
            const items = data.items;
            console.log(items.length);
            // searchService.getDataFromitems(items)
            //     .then((result) => {
            //         res.send(result);
            //     });

            let result = [];
            for (const element of items) {
                let tmp = {};
                tmp.id = element.id.videoId;
                tmp.title = element.snippet.title;
                tmp.thumbnail = element.snippet.thumbnails.default;
                await searchService.findBanju(tmp.id)
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
            res.send(result);
        })
        .catch((err) => {
            console.log("Axios request Error in Youtube Data API")
            console.log(err);
            res.send({ status: 'Error', error: err });
        });
})

module.exports = router;