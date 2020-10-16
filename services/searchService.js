const models = require('../db/models');
const config = require('../config/config');
const playmetaService = require('../services/playmetaService');
const axios = require('axios');

exports.searchDatas = (keyword) => {
    return new Promise((resolve, reject) => {
        const option = {
            method: 'GET',
            url: 'https://www.googleapis.com/youtube/v3/search',
            params: {
                part: 'snippet',
                q: keyword,
                type: 'video',
                key: config.googleapikey,
                maxResults: '10',
                order: 'relevance',
                topicId: '/m/04rlf'
            }
        }

        axios.request(option)
            .then(async ({ data }) => {
                const items = data.items;
                let result = [];
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
                        })
                    result.push(tmp);
                };
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            })
    });
};