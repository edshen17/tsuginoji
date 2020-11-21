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
        
        //transform so はたらく,　ハタラク, and hataraku get the same results as 働く
        if (wanakana.isRomaji(param) || wanakana.isHiragana(param) || wanakana.isKatakana(param)) { 
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
                "kanaLength": { $strLenCP: "$kana" },
                "wordLength": { $strLenCP: "$word" },
                "definitionLength": { $strLenCP: "$definition" },
                "audio": 1,
                }
            }, 
            {
                $match: { $or: matchOrArray}
            },
            {$sort: { "wordLength": 1, "kanaLength": 1, "pitch": -1, "definitionLength": -1, }},
            ]);
            const options = {
            page: req.query.page,
            limit: req.query.limit
        };
        
            Word.aggregatePaginate(aggregate, options, (err, docs) => {
                if (docs.docs.length > 0 ) {
                    res.status(200).json(docs.docs);
                } else {
                    res.status(404).json(docs.docs);
                }
                
            });
})

module.exports = router;