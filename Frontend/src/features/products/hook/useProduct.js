import { createProduct, deleteProduct, editProduct, getAllProduct, getProductById, getSellerProducts } from "../services/product.api";
import { useDispatch } from "react-redux";
import { seterror, setloading, setSellerProducts, setProducts } from "../state/product.slice";

export const useProduct = () => {
  const dispatch = useDispatch();

  const handleCreateProduct = async (formData) => {
    const response = await createProduct(formData);
    return response;
  };

  const handleGetSellerProducts = async () => {
    dispatch(setloading(true));
    try{
      const response = await getSellerProducts();
      dispatch(setSellerProducts(response.products));
      return response;
    } catch (error) {
      dispatch(seterror(error.message));
    } finally {
      dispatch(setloading(false));
    }
  };

  const handleDeleteProduct = async (id) => {
    const response = await deleteProduct(id)
    return response
  }

  const handleEditProduct = async (id, formData) => {
    const response = await editProduct(id, formData)
    return response
  }

  const handleGetProduct = async (id)=>{
    const response = await getProductById(id)
    return response
  }

  const handleGetAllProducts = async () => {
    dispatch(setloading(true));
    try{
      const response = await getAllProduct();
      dispatch(setProducts(response.products));
      return response;
    } catch (error) {
      dispatch(seterror(error.message));
    } finally {
      dispatch(setloading(false));
    }
  }

  return {
    handleCreateProduct,
    handleGetSellerProducts,
    handleDeleteProduct,
    handleEditProduct,
    handleGetProduct,
    handleGetAllProducts
  };
};
