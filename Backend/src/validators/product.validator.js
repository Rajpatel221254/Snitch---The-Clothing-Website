import { body, validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateCreateProduct = [
  body("title").notEmpty().withMessage("Product title is required"),
  body("description").notEmpty().withMessage("Product description is required"),
  body("priceAmount").notEmpty().withMessage("Product price amount is required"),
  body("priceCurrency")
    .notEmpty()
    .withMessage("Product price currency is required"),
  validateRequest
];