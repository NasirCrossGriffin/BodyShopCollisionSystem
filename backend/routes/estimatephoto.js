const express = require('express');
const router = express.Router();
const EstimatePhoto = require('../models/estimatephoto');


// CREATE
router.post('/', async (req, res) => {
  try {
    const doc = await EstimatePhoto.create(req.body);
    const populated = await EstimatePhoto.findById(doc._id).populate('estimateQuery');
    return res.status(201).json(populated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// READ ALL (optional filter: ?estimateQuery=<id>)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.estimateQuery) filter.estimateQuery = req.query.estimateQuery;

    const docs = await EstimatePhoto.find(filter).sort({ createdAt: -1 });
    return res.json(docs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const doc = await EstimatePhoto.findById(req.params.id).populate('estimateQuery');
    if (!doc) return res.status(404).json({ error: 'EstimatePhoto not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const doc = await EstimatePhoto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('estimateQuery');

    if (!doc) return res.status(404).json({ error: 'EstimatePhoto not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const doc = await EstimatePhoto.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'EstimatePhoto not found' });
    return res.json({ deleted: true, id: req.params.id });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
