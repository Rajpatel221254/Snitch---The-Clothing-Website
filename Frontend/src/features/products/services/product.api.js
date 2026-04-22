import axios from 'axios'

const productApiInstance = axios.create({
    baseURL: '/api/products',
    withCredentials: true,
})

export const createProduct = async (formData) => {
    const response = await productApiInstance.post('/', formData)

    return response.data
}

export const getSellerProducts = async () => {
    const response = await productApiInstance.get('/seller')

    return response.data
}

export const deleteProduct = async (id)=>{
    const response = await productApiInstance.delete(`/delete/${id}`)
    return response.data
}

export const editProduct = async (id,formData)=> {
    const response = await productApiInstance.put(`/edit/${id}`,formData)
    return response.data
}

export const getProductById = async (id) => {
    const response = await productApiInstance.get(`/get/${id}`)
    return response.data
}