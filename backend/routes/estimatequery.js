const express = require('express');
const router = express.Router();
const EstimateQuery = require('../models/estimatequery');
const BodyShop = require('../models/bodyshop')

// CREATE
router.post('/', async (req, res) => {
  try {
    const doc = await EstimateQuery.create(req.body);
    const populated = await EstimateQuery.findById(doc._id)
      .populate('bodyShop')
      .populate('user');
    return res.status(201).json(populated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// READ ALL (optional filters: ?bodyShop=<id>&user=<id>&status=new)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.bodyShop) filter.bodyShop = req.query.bodyShop;
    if (req.query.user) filter.user = req.query.user;
    if (req.query.status) filter.status = req.query.status;

    const docs = await EstimateQuery.find(filter)
      .populate('user')
      .sort({ createdAt: -1 });

    return res.json(docs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/:bodyshop', async (req, res) => {
  console.log(req.params.bodyshop)

  const bodyShop = await getBodyShopByName(req.params.bodyshop);

  if (!(bodyShop)) return res.status(400).json("No such bodyshop")

  const estimateQueries = await EstimateQuery.find({bodyShop : bodyShop._id.toString()});

  return res.status(200).json(estimateQueries);
})

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const doc = await EstimateQuery.findById(req.params.id)
      .populate('bodyShop')
      .populate('user');

    if (!doc) return res.status(404).json({ error: 'EstimateQuery not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const doc = await EstimateQuery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('bodyShop')
      .populate('user');

    if (!doc) return res.status(404).json({ error: 'EstimateQuery not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const doc = await EstimateQuery.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'EstimateQuery not found' });
    return res.json({ deleted: true, id: req.params.id });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

//middleware 
async function getBodyShopByName(name) {
  const acquiredBodyShop = await BodyShop.findOne({name : name})

  if (!(acquiredBodyShop)) return null;

  console.log(acquiredBodyShop);

  return acquiredBodyShop;
}

module.exports = router;
