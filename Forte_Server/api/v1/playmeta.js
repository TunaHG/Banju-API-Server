const express = require('express');
const { find, update } = require('../../services/playmetaService');

const router = express.Router();

// Get Converted Result for Client
router.get('/:link', (req, res) => {
    const result = find(req.params.link);
    console.log("/playmeta GET result: ", result);
    res.send(result);
});
// Save Data to DB, about Convereted Result from AI Model
router.post('/', (req, res) => {
    update(req.body.link, req.body.content);
    console.log("Update Success in /playmeta POST");
});
// Update Result with CLient's participation
//router.put();
// Delete Result What Client want to delete
//router.delete();

module.exports = router;