const express = require('express');
const config = require('../../config/config');
const axios = require('axios');
const searchService = require('../../services/searchService');

const router = express.Router();

router.get('/:keyword', async (req, res) => {
    const keyword = req.params.keyword;

    const option = {
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/search',
        params: {
            part: 'snippet',
            q: keyword,
            type: 'video',
            key: config.googleapikey,
            maxResult: 10,
            order: 'relevance',
            topicId: '/m/04rlf'
        }
    }

    let result = [];
    await axios.request(option)
        .then(({ data }) => {
            items = data.items;
            items.forEach(async (element) => {
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
                    })
                result.push(tmp);
                console.log(result);
            });
        })
        .catch((err) => {
            console.log("Axios request Error in Youtube Data API")
            console.log(err);
            res.send({ status: 'Error', error: err });
        });
    console.log(1);
    res.send(result);
})

module.exports = router;