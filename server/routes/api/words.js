const express = require('express');
const mongoose = require('mongoose');
const wanakana = require('wanakana')
const Word = require('../../models/Word');
const router = express.Router();
const db = require('../../../config/keys').MongoURI;

// Connect to Mongodb
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.log(err));

// Get Words
router.get('/:word', (req,res) => {
    let katakana = '';
        const param = req.params.word.trim();
        const matchOrArray = [
            { kana: { $regex: `${param}`, $options: "g" } }, 
            { word: { $regex: `${param}`, $options: "g" } },
        ]
        if (wanakana.isRomaji(param)) {
            hiragana = wanakana.toHiragana(param);
            katakana = wanakana.toKatakana(param);
            matchOrArray[0].kana.$regex = hiragana;
            matchOrArray[1].word.$regex = hiragana;
            matchOrArray.push({ kana: { $regex: `${katakana}`, $options: "g" } });
        }
            let aggregate = Word.aggregate([
            {
                $project: {
                "word": 1,
                "kana": 1,
                "definition": 1,
                "pitch": 1,
                "kana_length": { $strLenCP: "$kana" },
                "audio": 1,
                }
            }, 
            {
                $match: { $or: matchOrArray}
            },
            {$sort: {"kana_length": 1, "pitch": -1, "definition": 1}},
            ]);
            const options = {
            page: req.query.page,
            limit: req.query.limit
        };
        
            Word.aggregatePaginate(aggregate, options, (err, docs) => {
                res.status(200).json(docs.docs);
            });
})

module.exports = router;