const models = require('../db/models');
const axios = require('axios');
const config = require('../config/config');
const _ = require('underscore');

exports.recommendBanju = (scale) => {
    return new Promise((resolve, reject) => {
        models.Recommends.findAll({
            attributes: ['video_id', 'title', 'thumbnails'],
            where: {
                scale: scale
            }
        })
            .then((data) => {
                console.log('recommend banju query success');
                const sample = _.sample(data, 8);
                let result = [];
                for (const element of sample) {
                    let item = element.dataValues;
                    let tmp = {};
                    tmp.id = item.video_id;
                    tmp.title = item.title;
                    tmp.thumbnails = item.thumbnails;
                    tmp.scale = scale;
                    result.push(tmp);
                }
                resolve(result);
            })
            .catch((err) => {
                console.log('recommend banju query failed');
                reject(err);
            })
    });
};

exports.createRecommend = (content) => {
    return new Promise((resolve, reject) => {
        this.checkRecommendData(content.meta.link)
            .then((result) => {
                if (result === null) {
                    const option = {
                        method: 'GET',
                        url: 'https://www.googleapis.com/youtube/v3/videos',
                        params: {
                            part: 'snippet',
                            id: content.meta.link,
                            key: config.googleapikey
                        }
                    }

                    axios.request(option)
                        .then(({ data }) => {
                            const items = data.items;
                            const thumbnails = items[0].snippet.thumbnails.default;
                            models.Recommends.create({
                                video_id: content.meta.link,
                                scale: content.meta.scale,
                                title: content.meta.songName,
                                thumbnails: thumbnails
                            })
                                .then((recommend) => {
                                    recommend.save();
                                    console.log('Recommend save success');
                                    resolve('create success');
                                })
                                .catch((err) => {
                                    console.log('Recommend save failed');
                                    reject(err);
                                })
                        })
                        .catch((err) => {
                            console.log('error');
                            console.log(err.message);
                            reject(err);
                        })
                } else {
                    resolve('already exist');
                }
            })
            .catch((err) => {
                reject(err);
            })
    });
}

exports.checkRecommendData = (videoId) => {
    return new Promise((resolve, reject) => {
        models.Recommends.findOne({
            attributes: ['id'],
            where: {
                video_id: videoId
            }
        })
            .then((data) => {
                console.log('Check recommend data');
                if (data === null) {
                    resolve(null);
                } else {
                    resolve(true);
                }
            })
            .catch((err) => {
                reject(err);
            })
    })
}