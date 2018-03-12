const express = require('express');
const router = express.Router();

router.get('/', (req, res, next)=>{
    res.status(200).json({
        message: 'get account'
    });
});

router.post('/', (req, res, next)=>{
    res.status(201).json({
        message: 'post to  account'
    });
});

router.get('/:id', (req, res, next)=>{
    res.status(200).json({
        message: 'get specific item'
    });
});




module.exports = router;