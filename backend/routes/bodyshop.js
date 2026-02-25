const express = require('express');
const router = express.Router();
const BodyShop = require('../models/bodyshop');

// CREATE
router.post('/', async (req, res) => {
  try {
    const doc = await BodyShop.create(req.body);
    return res.status(201).json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// READ ALL
router.get('/', async (req, res) => {
  try {
    const docs = await BodyShop.find().sort({ createdAt: -1 });
    return res.json(docs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// READ BY NAME
router.get('/name/:name', async (req, res) => {
  try {
    const name = req.params.name;

    console.log(name);

    const doc = await BodyShop.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') } // case-insensitive exact match
    });

    if (!doc) return res.status(404).json({ error: 'BodyShop not found' });

    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const doc = await BodyShop.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'BodyShop not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const doc = await BodyShop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) return res.status(404).json({ error: 'BodyShop not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const doc = await BodyShop.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'BodyShop not found' });
    return res.json({ deleted: true, id: req.params.id });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
