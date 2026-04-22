import React from "react";
import EditProduct from "./EditProduct";
import { useState } from "react";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useProduct } from "../hook/useProduct";

const EditProductPage = () => {
  const { id } = useParams();
  const { handleEditProduct, handleGetProduct } = useProduct();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      const response = await handleGetProduct(id);
      console.log(response);
      setProduct(response.product);
    }

    fetchProduct();
  }, []);

  return product ? (
    <EditProduct product={product} id={id} />
  ) : (
    <div className="text-white text-center mt-10">Loading...</div>
  );
};

export default EditProductPage;
