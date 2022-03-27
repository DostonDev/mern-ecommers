const Category = require("../models/categoryModal");

const categoryCtrl = {
  getCategory: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category.findOne({ name });
      if (category) return res.status(400).json({ msg: "This category alreadt exist." });

      const newCategory = new Category({ name });
      await newCategory.save();
      res.json({ msg: "Category created." });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.json({ msg: "Delete category." });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category.findOne({ _id: req.params.id });
      if (!category) return res.status(400).json({ msg: "Category does not exist." });

      await Category.findByIdAndUpdate(req.params.id, { name });
      res.json({ msg: "Category updated" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
module.exports = categoryCtrl;
