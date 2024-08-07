const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');

router.get('/protected', authenticateToken, (req, res) => {
    res.send('Contenido protegido');
});

module.exports = router;
