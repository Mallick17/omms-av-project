const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Equipment = require('../models/Equipment');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all equipment
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    const equipment = await Equipment.find(query)
      .populate('category', 'name icon')
      .sort({ createdAt: -1 });

    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single equipment
router.get('/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate('category');
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get equipment by category
router.get('/category/:categoryId', async (req, res) => {
  try {
    const equipment = await Equipment.find({ category: req.params.categoryId })
      .populate('category', 'name icon')
      .sort({ createdAt: -1 });

    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create equipment (admin only)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, category, icon, description, price, specifications, featured } = req.body;

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Category not found' });
    }

    const equipment = new Equipment({
      name,
      category,
      icon: icon || '',
      image: req.file ? `/uploads/${req.file.filename}` : '',
      description,
      price: price || 'Price on enquiry',
      specifications: specifications || '',
      featured: featured === 'true'
    });

    await equipment.save();
    await equipment.populate('category', 'name icon');

    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update equipment (admin only)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, category, icon, description, price, specifications, featured } = req.body;

    const updateData = {
      name,
      category,
      icon,
      description,
      price,
      specifications,
      featured: featured === 'true'
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('category', 'name icon');

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete equipment (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
