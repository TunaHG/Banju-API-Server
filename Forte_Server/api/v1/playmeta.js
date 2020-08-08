const express = require('express');

// get config file for sequelize
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../config/.env') });

const router = express.Router();

// Get Converted Result for Client
router.get('/:link', (req, res) => {
    
});
// Save Data to DB, about Convereted Result from AI Model
router.post();
// Update Result with CLient's participation
router.put();
// Delete Result What Client want to delete
router.delete();

module.exports = router;