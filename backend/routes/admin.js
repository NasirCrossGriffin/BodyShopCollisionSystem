const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Admin = require('../models/admin');
const bodyshop = require('../models/bodyshop');
dotenv = require("dotenv").config();


// CREATE
router.post('/register', async (req, res) => {
  if (req.body.key !== process.env.ADMIN_KEY) res.status(403)

  try {
    const username = req.body.username;
    const password = req.body.password;
    const bodyshop = req.body.bodyshop;

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    const newAdmin = await Admin.create({
      username : username,
      password : hash,
      bodyShop : bodyshop
    })

    console.log(newAdmin);

    res.status(200).json(newAdmin);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

router.post('/autheticate', async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const autobody = req.body.autobody;

    console.log(username);
    console.log(password);
    console.log(autobody);

    const admin = await Admin.findOne({username : username});

    console.log(admin);

    console.log(admin.bodyShop);

    if (!(admin.bodyShop.toString() === autobody)) return; 

    console.log("Autobody match established")

    if (!(admin)) return res.status(400).json("Incorrect credentials");

    const match = await bcrypt.compare(password, admin.password);

    if (match === false) res.status(400).json("Incorrect credentials");;

    console.log("Credentials validated")

    // Set session
    req.session.adminId = admin._id.toString();
    req.session.username = admin.username;
    req.session.bodyShop = admin.bodyShop;

    return res.status(200).json({ _id: admin._id, username : username, bodyshop : admin.bodyShop });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// READ ALL (optional filters: ?bodyShop=<id>)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.bodyShop) filter.bodyShop = req.query.bodyShop;

    const docs = await Admin.find(filter).select('-password').sort({ createdAt: -1 });
    return res.json(docs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/check', async (req, res) => {
    try {
        const adminId = req.session.adminId;
        const bodyShopId = req.body.bodyShopId;

        console.log(adminId);

        if (!adminId) {return res.status(400).json("Admin verification failed")}

        const verifyAdmin = await Admin.findOne({_id : adminId});

        if (!verifyAdmin) {return res.status(400).json("Admin verification failed")}

        console.log(verifyAdmin.bodyShop._id.toString());

        console.log(bodyShopId);

        if (!(verifyAdmin.bodyShop._id.toString() === bodyShopId)) {return res.status(400).json("Admin verification failed")}

        console.log("Verification Successful")

        res.status(200).json("Admin verification passed"); return;
    } catch(err) {
        console.log(err);
        return res.status(500).json({ error: "Admin verification failed" });
    }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const doc = await Admin.findById(req.params.id).select('-password');
    if (!doc) return res.status(404).json({ error: 'Admin not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// UPDATE (NOTE: if you update password, your model pre-save hook won’t run with findByIdAndUpdate)
// For password changes, create a dedicated endpoint that loads doc + doc.save().
router.put('/:id', async (req, res) => {
  try {
    // prevent accidentally returning password
    const update = { ...req.body };
    delete update.password;

    const doc = await Admin.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!doc) return res.status(404).json({ error: 'Admin not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const doc = await Admin.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Admin not found' });
    return res.json({ deleted: true, id: req.params.id });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;
