const playmetaService = require('../services/playmetaService');
const axios = require('axios');

exports.searchPopularDatas = (option) => {
    return new Promise((resolve, reject) => {
        axios.request(option)
            .then(async ({ data }) => {
                const items = data.items;
                let resultjson = {};
                let result = [];
                resultjson.nextPageToken = data.nextPageToken;
                for (const element of items) {
                    let tmp = {};
                    tmp.id = element.id;
                    tmp.title = element.snippet.title;
                    tmp.thumbnail = element.snippet.thumbnails.default;
                    await playmetaService.findBanjuByLink(tmp.id)
                        .then((result) => {
                            if (result === null) {
                                tmp.convert = 'Need Banju';
                            }
                            else {
                                tmp.convert = 'Banjued';
                                tmp.scale = result.meta.scale;
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