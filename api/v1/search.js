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
            maxResult: 10
        }
    }

    let result = [];
    axios.request(option)
    .then(({items}) => {
        items.forEach(item => {
            let tmp = {};
            tmp.id = item.id.videoId;
            tmp.title = item.snippet.title;
            tmp.thumbnail = item.snippet.thumbnails.default;
            searchService.findBanju(tmp.id)
            .then((result) => {
                // TODO: Banju의 Scale 추가
                tmp.convert = 'Banjued';
            })
            .catch((err) => {
                tmp.convert = 'Need Banju';
            })
            result.push(tmp);
        });
        res.send(result);
    })
    .catch((err) => {
        console.log("Axios request Error in Youtube Data API")
        res.send({status: 'Error'});
    })
})

module.exports = router;