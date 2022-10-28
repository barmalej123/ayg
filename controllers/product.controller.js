const Product = require("../models/product.model");
const fs = require('fs');
const excelJS = require('exceljs')

const createProduct = async (req, res) => {
  try {
    const {
      name,
      type,
      quantity,
      storage,
      dateOfDestribution,
      unit,
      expirationDate,
      price,
      supplier,
      dateOfEntry,
      material,
      lot
    } = req.body

    const product = await Product.create({
      name,
      type,
      quantity,
      dateOfDestribution,
      unit,
      expirationDate,
      storage,
      price,
      supplier,
      dateOfEntry,
      material,
      lot
    });
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}

const getProduct = async (req, res) => {
  try {
    const  productId  = req.params.productId
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product)

  } catch (error) {
    res.status(500).json({ message: "something went wrong" })
  }
}

const getProducts = async (req, res) => {
  const filterConditions = {};
  const isStorageSpecified = req.query.isStorageSpecified;

  try {
    if (isStorageSpecified) {
      filterConditions.storage = isStorageSpecified === '1' ? { $ne: null } : null 
    }

    const products = await Product.find(filterConditions);
  

    if (!products) return res.status(404).json({ messege: 'Products not found' })

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: "something went wrong" })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const  productId  = req.params.productId
    const product = await Product.findByIdAndDelete(productId)

    if (!product) return res.status(404).json({ message: 'Product not found' });

    return res.json(200, { message: "product deleted" })

  } catch (error) {
    res.status(500).json({ message: "something went wrong" })
  }
}

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId

    const updatedProduct = {
      name: req.body.name,
      type: req.body.type,
      storage: req.body.storage,
      quantity: req.body.quantity,
      dateOfDestribution: req.body.dateOfDestribution,
      unit: req.body.unit,
      expirationDate: req.body.expirationDate,
      price: req.body.price,
      supplier: req.body.supplier,
      dateOfEntry: req.body.dateOfEntry,
      lot: req.body.lot,
      material: req.body.material
    }

    await Product.findByIdAndUpdate(productId, {$set: updatedProduct})

    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    res.json({message: "product updated"})

  } catch (error) {
    res.status(500).json({ message: "something went wrong" })
  }
}

const exportProducts = async (req, res) => {
  try {
   const workbook = new excelJS.Workbook()
   const worksheet = workbook.addWorksheet("Products")

   worksheet.columns = [
      {header: "name", key: "name"},
      {header: "type", key: "type"},
      {header: "quantity", key: "quantity"},
      {header: "unit", key: "unit"},
      {header: "expirationDate", key: "expirationDate"},
      {header: "price", key: "price"},
      {header: "supplier", key: "supplier"},
      {header: "storage", key: "storage"},
      {header: "dateOfEntry", key: "dateOfEntry"},
      {header: "material", key: "material"},
      {header: "dateOfDestribution", key: "dateOfDestribution"},
      {header: "lot", key: "lot"},
   ]
   const productData = await Product.find()
   productData.forEach((product) => {
    worksheet.addRow(product)
   })
   worksheet.getRow(1).eachCell((cell) => {
    cell.font = {bold: true}
   })

   res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
    )
    res.setHeader("Content-Disposition", `attachment; filename=products.x1sx`)

    return workbook.x1sx.write(res).then(()=>{
      res.status(200)
    })
  } catch (error) {
    res.status(500).json({ message: "something went wrong" })
  }
}


module.exports = {
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  getProducts,
  exportProducts,
}
