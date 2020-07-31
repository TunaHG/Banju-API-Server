const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	let value = [
		{
			userID: req.query.userID,
			link: req.query.link
		}
	];
	return res.json(value);
});

module.exports = router;
