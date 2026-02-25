const express = require('express');
const router = express.Router();
const Estimate = require('../models/estimate');

// CREATE
router.post('/', async (req, res) => {
  try {
    const doc = await Estimate.create(req.body);
    const populated = await Estimate.findById(doc._id).populate({
      path: 'estimateQuery',
      populate: [{ path: 'user' }, { path: 'bodyShop' }]
    });
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

    const docs = await Estimate.find(filter)
      .populate('estimateQuery')
      .sort({ createdAt: -1 });

    return res.json(docs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const doc = await Estimate.findById(req.params.id).populate({
      path: 'estimateQuery',
      populate: [{ path: 'user' }, { path: 'bodyShop' }]
    });

    if (!doc) return res.status(404).json({ error: 'Estimate not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const doc = await Estimate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate({
      path: 'estimateQuery',
      populate: [{ path: 'user' }, { path: 'bodyShop' }]
    });

    if (!doc) return res.status(404).json({ error: 'Estimate not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const doc = await Estimate.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Estimate not found' });
    return res.json({ deleted: true, id: req.params.id });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
