import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: {
    amount: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      enum: ["USD", "INR", "EUR", "GBP", "JPY", "CNY"],
      default: "INR",
    },
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
    },
  ],
  variants: [
    {
      images: [
        {
          url: {
            type: String,
            required: true,
          },
        },
      ],
      stock: {
        type: Number,
        default: 0,
      },
      attributes: {
        type: Map,
        of: String,
      },
      price: {
        amount: {
          type: String,
          required: true,
        },
        currency: {
          type: String,
          enum: ["USD", "INR", "EUR", "GBP", "JPY", "CNY"],
          default: "INR",
        },
      },
    },
  ],
});

const productModel = mongoose.model("Product", productSchema);

export default productModel;
