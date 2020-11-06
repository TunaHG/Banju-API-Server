const express = require('express');
const passport = require('passport');
const recommendService = require('../../services/recommendService');

const router = express.Router();

router.get('/:scale', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const scale = req.params.scale;
    recommendService.recommendBanju(scale)
        .then((data) => {
            console.log('recommend success');
            res.status(200).send(data);
        })
        .catch(next);
});

module.exports = router;