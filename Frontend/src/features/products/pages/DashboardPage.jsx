import React, { useEffect } from 'react'
import { useProduct } from '../hook/useProduct.js';
import SellerDashboard from './SellerDashboard';
import { useSelector } from 'react-redux';

const DashboardPage = () => {
    const { handleGetSellerProducts, handleDeleteProduct } = useProduct();
    const products = useSelector((state) => state.product.products); // Access product state to trigger re-render on updates
    const loading = useSelector((state) => state.product.loading); // Access product state to trigger re-render on updates
    const error = useSelector((state) => state.product.error); // Access product state to trigger re-render on updates
    const onDelete = async (id)=>{
      const response = await handleDeleteProduct(id)
    }

    const onRefetch = async () => {
     await handleGetSellerProducts()
    }

    useEffect(()=>{
        handleGetSellerProducts();
    }, [])

  return (
    <SellerDashboard products={products} loading={loading} error={error}  onDelete={onDelete} onRefetch={onRefetch}/>
  )
}

export default DashboardPage
