const categoryModal = require("../models/categoryModal");
const Products = require("../models/productModel");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString };

    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => "$" + match);

    this.query.find(JSON.parse(queryStr));

    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createAt");
    }
    return this;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 8;
    const skip = (page - 1) * limit;
    // console.log(limit, page);
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const productCtrl = {
  getProducts: async (req, res) => {
    const features = new APIfeatures(Products.find(), req.query).filtering().sorting().paginating();
    const products = await features.query;

    // const products1 = await Products.find({ title: { $regex: "woman" }, price: "31" });
    // console.log(products1);

    res.json({
      status: "Success",
      result: products.length,
      products,
    });
    try {
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createProduct: async (req, res) => {
    const { product_id, title, price, description, content, images, category } = req.body;
    if (!images) return res.status(400).json({ msg: "Image is not uploaded." });

    const myCategory = await categoryModal.findOne({ name: category });
    if (!myCategory) return res.status(400).json({ msg: "Category does not exist." });

    const product = await Products.findOne({ product_id });
    if (product) return res.status(400).json({ msg: "This product already exist." });

    const newProduct = new Products({
      product_id,
      title: title.toLowerCase(),
      price,
      description,
      content,
      images,
      category,
    });

    await newProduct.save();

    res.json({ msg: "Product created" });

    try {
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const product = await Products.findById(req.params.id);
      if (!product) return res.status(400).json({ msg: "Product not found." });
      await Products.findByIdAndDelete({ _id: req.params.id });
      res.json({ msg: "Product deleted" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { product_id, title, price, description, content, images, category } = req.body;
      const product = await Products.findOne({ _id: req.params.id });
      if (!product) return res.status(400).json({ msg: "Product not found" });
      if (!images) return res.status(400).json({ msg: "Image not uploaded" });

      await Products.findByIdAndUpdate(
        { _id: req.params.id },
        {
          product_id,
          title,
          price,
          description,
          content,
          images,
          category,
        }
      );
      res.json({ msg: "Product changed." });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = productCtrl;
