import productModel from "../models/product.model.js";
import { uploadImage } from "../services/storage.service.js";

export const createProduct = async (req, res) => {
  const { title, description, priceAmount, priceCurrency } = req.body;
  const seller = req.user;

  try {
    const images = await Promise.all(
      req.files.map(async (file) => {
        return await uploadImage({
          buffer: file.buffer,
          fileName: file.originalname,
        });
      }),
    );

    const product = await productModel.create({
      title,
      description,
      seller: seller._id,
      price: {
        amount: priceAmount,
        currency: priceCurrency || "INR",
      },
      images,
    });

    res.status(201).json({
      message: "Product created successfully",
      success: true,
      product,
    });
  } catch (error) {
    return res
      .status(501)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getSellerProducts = async (req, res) => {
  const seller = req.user;

  const products = await productModel.find({ seller: seller._id });

  res.status(200).json({
    message: "Seller products fetched successfully",
    success: true,
    products,
  });
};

export const deleteProduct = async (req, res) => {
  const seller = req.user;
  const productId = req.params.id;

  await productModel.findByIdAndDelete(productId);

  res.status(200).json({
    message: "Product Deleted Successfully",
    success: true,
  });
};

export const editProduct = async (req, res) => {
  const { _id: sellerId } = req.user;
  const { id: productId } = req.params;
  const { title, description, priceAmount, priceCurrency } = req.body;

  const product = await productModel.findOne({
    seller: sellerId,
    _id: productId,
  });

  const images = req.files?.length
    ? await Promise.all(
        req.files.map((file) =>
          uploadImage({ buffer: file.buffer, fileName: file.originalname }),
        ),
      )
    : product.images;

  Object.assign(product, {
    title: title || product.title,
    description: description || product.description,
    images,
  });

  product.price.amount = priceAmount || product.price.amount;
  product.price.currency = priceCurrency || product.price.currency;

  await product.save();

  res.status(200).json({
    message: "Product Edited successfully",
    success: true,
    product,
  });
};

export const getProduct = async (req, res) => {
  const productId = req.params.id;

  const product = await productModel.findById(productId);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      success: false,
    });
  }

  res.status(200).json({
    message: "Product Fetch succesfully",
    product,
    sucess: true,
  });
};

export async function getAllProduct(req, res) {
  const products = await productModel.find();

  res.status(200).json({
    message: "Products fetched succesfully",
    products,
    success: true,
  });
}

export async function createVariant(req, res) {
  const productId = req.params.id;
  const seller = req.user;

  const stock = Number(req.body.stock);
  const attributes = JSON.parse(req.body.attributes);
  const price = JSON.parse(req.body.price);
  price.amount = Number(price.amount);

  const files = req.files;

  const product = await productModel.findOne({
    _id: productId,
    seller: seller._id,
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let images = [];

  if (files && files.length > 0) {
    images = await Promise.all(
      files.map((file) =>
        uploadImage({
          buffer: file.buffer,
          fileName: file.originalname,
        }),
      ),
    );
  }

  console.log(stock, attributes, price);

  product.variants.push({
    images,
    price,
    stock,
    attributes,
  });

  await product.save();

  res.status(200).json({
    message: "Variant Created Succesfully",
    product,
  });
}
