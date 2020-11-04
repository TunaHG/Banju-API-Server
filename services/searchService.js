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
                    await playmetaService.findBanjuByLink(tmp.id)
                        .then((result) => {
                            if (result === null) {
                                tmp.convert = 'Need Banju';
                            } else if (result.status === 'error') {
                                tmp.convert = 'error';
                            } else {
                                if (result.content.status === 'working') {
                                    tmp.convert = 'Banjuing';
                                } else {
                                    tmp.convert = 'Banjued';
                                    tmp.scale = result.meta.scale;
                                }
                            }
                        })
                        .catch((err) => {
                            console.log('findBanju Function error in search API');
                            console.log(err);
                            reject(err);
                        });
                    result.push(tmp);
                };
                resultjson.items = result;
                resolve(resultjson);
            })
            .catch((err) => {
                reject(err.response.data.error);
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
                const duration = items[0].contentDetails.duration;
                console.log('Get videoDuration from youtube api');
                resolve(duration);
            })
            .catch((err) => {
                console.log('error from axios about video contentDetails api');
                console.log(err.message);
                reject(err);
            });
    });
};

exports.tempSearchDatas = (keyword) => {
    return new Promise((resolve, reject) => {
        const option = {
            method: 'GET',
            url: 'http://dailybanju.com/hotfix',
            params: {
                keyword: keyword
            }
        }
        axios.request(option)
            .then(async ({ data }) => {
                const items = data.search_result;
                let resultjson = {};
                let result = [];
                // resultjson.nextPageToken = search_result.nextPageToken;
                for (const element of items) {
                    if (element.duration === 'LIVE') {
                        continue;
                    }
                    let tmp = {};
                    tmp.id = element.id;
                    tmp.title = element.title;
                    tmp.thumbnail = { url: element.thumbnails[0] };
                    await playmetaService.findBanjuByLink(tmp.id)
                        .then((result) => {
                            if (result === null) {
                                tmp.convert = 'Need Banju';
                            } else if (result.status === 'error') {
                                tmp.convert = 'error';
                            } else {
                                if (result.content.status === 'working') {
                                    tmp.convert = 'Banjuing';
                                } else {
                                    tmp.convert = 'Banjued';
                                    tmp.scale = result.meta.scale;
                                }
                            }
                        })
                        .catch((err) => {
                            console.log('findBanju Function error in search API');
                            console.log(err);
                            reject(err);
                        });
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