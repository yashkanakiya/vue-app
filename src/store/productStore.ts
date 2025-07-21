import { defineStore } from 'pinia';
import axios from 'axios';

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [],
        loading: false,
    }),
    actions: {
        async fetchProducts() {
            this.loading = true;
            try {
                const response = await axios.get('https://fakestoreapi.com/products');
                this.products = response.data;
            } catch (error) {
                console.error(error.message);
            } finally {
                this.loading = false;
            }
        },
        async addProduct(product) {
            try {
                const response = await axios.post('https://fakestoreapi.com/products', product);
                this.products.unshift(response.data);
            } catch (error) {
                console.error(error.message);
            }
        },
        async editProduct(id, updatedProduct) {
            try {
                const response = await axios.put(`https://fakestoreapi.com/products/${id}`, updatedProduct);
                const index = this.products.findIndex(product => product.id === id);
                if (index !== -1) this.products[index] = response.data;
            } catch (error) {
                console.error(error.message);
            }
        },
        async deleteProduct(id) {
            try {
                await axios.delete(`https://fakestoreapi.com/products/${id}`);
                this.products = this.products.filter(product => product.id !== id);
            } catch (error) {
                console.error(error.message);
            }
        },
        async filterProducts(category) {
            this.loading = true;
            try {
                const url = category
                    ? `https://fakestoreapi.com/products/category/${category}`
                    : 'https://fakestoreapi.com/products';
                const response = await axios.get(url);
                this.products = response.data;
            } catch (error) {
                console.error(error.message);
            } finally {
                this.loading = false;
            }
        },
    },
});