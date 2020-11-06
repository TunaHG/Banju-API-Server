const express = require('express');
const config = require('../../config/config');
const passport = require('passport');
const popularService = require('../../services/popularService');

const router = express.Router();

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const option = {
        method: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/videos',
        params: {
            part: 'snippet',
            chart: 'mostPopular',
            regionCode: 'kr',
            key: config.googleapikey,
            videoCategoryId: '10',
            maxResults: '10'
        }
    }

    popularService.searchPopularDatas(option)
        .then((result) => {
            console.log('Success popular search');
            res.status(200).send(result);
        })
        .catch(next);
});

module.exports = router;