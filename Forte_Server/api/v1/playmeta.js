const express = require('express');
const DBService = require('../../services/playmetaService');

const router = express.Router();

// Get Converted Result for Client
router.get('/:link', (req, res) => {
    const find = DBService.find(req.params.link);
    console.log("/playmeta GET result: ", find);
    res.send(find);
});
// Save Data to DB, about Convereted Result from AI Model
router.post('/', (req, res) => {
    DBService.update(req.body.link, req.body.result);
    console.log("Update Success in /playmeta POST");
});
// Update Result with CLient's participation
router.put();
// Delete Result What Client want to delete
router.delete();

module.exports = router;