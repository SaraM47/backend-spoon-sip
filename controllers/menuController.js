const MenuItem = require('../models/MenuItem');

// GET – Fetch menu items, optionally filtered by category
exports.getMenuItems = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const items = await MenuItem.find(query);
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch menu items', error: err.message });
  }
};

// GET – Fetch a single menu item by ID
exports.getMenuItemById = async (req, res) => {
    try {
      const item = await MenuItem.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      res.status(200).json(item);
    } catch (err) {
      res.status(500).json({ message: 'Could not fetch menu item', error: err.message });
    }
  };  

// POST – Create a new menu item, including image upload
exports.createMenuItem = async (req, res) => {
  try {
    const { name, price, ingredients, category } = req.body;
    const image = req.file ? req.file.path : null;

    const item = new MenuItem({
      name,
      price,
      ingredients: ingredients ? ingredients.split(',') : [],
      category,
      image,
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Could not create item', error: err.message });
  }
};

// PUT – Update an existing menu item, optionally with new image
exports.updateMenuItem = async (req, res) => {
  try {
    const update = {
      ...req.body,
    };

    if (req.file) {
      update.image = req.file.path;
    }

    const item = await MenuItem.findByIdAndUpdate(req.params.id, update, { new: true });
    res.status(200).json(item);
  } catch (err) {
    res.status(400).json({ message: 'Could not update item', error: err.message });
  }
};

// DELETE – Remove a menu item by ID
exports.deleteMenuItem = async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: 'Could not delete item', error: err.message });
  }
};
