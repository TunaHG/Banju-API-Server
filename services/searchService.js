const models = require('../db/models');
const config = require('../config/config');
const playmetaService = require('../services/playmetaService');
const axios = require('axios');

exports.searchDatas = (option) => {
    return new Promise((resolve, reject) => {
        axios.request(option)
            .then(async ({ data }) => {
                const items = data.items;
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
                            reject(err);
                        });
                    tmp.duration = await this.getDuration(tmp.id);
                    result.push(tmp);
                };
                resultjson.items = result;
                resolve(resultjson);
            })
            .catch((err) => {
                reject(err);
            })
    });
};

exports.getDuration = (videoId) => {
    return new Promise((resolve, reject) => {
        const option = {
            method: 'GET',
            url: 'https://www.googleapis.com/youtube/v3/videos',
            params: {
                key: config.googleapikey,
                id: videoId,
                part: 'contentDetails'
            }
        }

        axios.request(option)
            .then(({ data }) => {
                const items = data.items;
                console.log('Get videoDuration from youtube api');
                resolve(items[0].contentDetails.duration);
            })
            .catch((err) => {
                console.log('error from axios about video contentDetails api');
                console.log(err.message);
                resolve('PT0M00S');
            });
    });
};