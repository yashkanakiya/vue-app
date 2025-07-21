<script setup lang="ts">

import { useProductStore } from "../store/productStore";
import { onMounted } from "vue";
import { ref } from "vue";

const productStore = useProductStore();

const products = ref(productStore.products);
const loading = ref(productStore.loading);

const categories = ref(["electronics", "jewelery", "men's clothing", "women's clothing"]);

const selectedCategory = ref("");
const newProduct = ref({
  title: "",
  price: 0,
  category: "",
  description: "",
});
const editMode = ref(false);
const editingProductId = ref(null);

const syncState = () => {
  products.value = productStore.products;
  loading.value = productStore.loading;
};

onMounted(async () => {
  await productStore.fetchProducts();
  syncState();
});

const submitProduct = async () => {
  if (editMode.value) {
    await productStore.editProduct(editingProductId.value, { ...newProduct.value });
    editMode.value = false;
    editingProductId.value = null;
  } else {
    await productStore.addProduct({ ...newProduct.value });
  }
  newProduct.value = { title: "", price: 0, category: "", description: "" };
  syncState();
};

const editProductHandler = (product) => {
  newProduct.value = { ...product };
  editMode.value = true;
  editingProductId.value = product.id;
};

const cancelEdit = () => {
  newProduct.value = { title: "", price: 0, category: "", description: "" };
  editMode.value = false;
  editingProductId.value = null;
};

const deleteProductHandler = async (id) => {
  await productStore.deleteProduct(id);
  syncState();
};

const filterProducts = async () => {
  await productStore.filterProducts(selectedCategory.value);
  syncState();
};
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold text-center mb-6">Product Management Dashboard</h1>

    <div v-if="loading" class="text-center text-gray-600">Loading...</div>

    <div v-else class="mb-8 bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">
        {{ editMode ? "Edit Product" : "Add New Product" }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Title</label>
          <input
            v-model="newProduct.title"
            type="text"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Product Title"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Price</label>
          <input
            v-model.number="newProduct.price"
            type="number"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Price"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Category</label>
          <select
            v-model="newProduct.category"
            placeholder="Select Category"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2"
          >
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Description</label>
          <input
            v-model="newProduct.description"
            type="text"
            class="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Description"
          />
        </div>
      </div>
      <div class="mt-4 flex space-x-2">
        <button
          @click="submitProduct"
          class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          {{ editMode ? "Update Product" : "Add Product" }}
        </button>
        <button
          v-if="editMode"
          @click="cancelEdit"
          class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>

    <div class="mb-6 flex flex-col sm:flex-row sm:space-x-4">
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700">Filter by Category</label>
        <select
          v-model="selectedCategory"
          @change="filterProducts"
          class="mt-1 block w-full border border-gray-300 rounded-md p-2"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </div>

    <div class="block md:hidden">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white p-4 mb-4 rounded-lg shadow-md"
      >
        <h3 class="text-lg font-semibold">{{ product.title }}</h3>
        <p class="text-gray-600">Price: ${{ product.price }}</p>
        <p class="text-gray-600">Category: {{ product.category }}</p>
        <p class="text-gray-600">{{ product.description }}</p>
        <div class="mt-2 flex space-x-2">
          <button
            @click="editProductHandler(product)"
            class="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            @click="deleteProductHandler(product.id)"
            class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <div class="hidden md:block">
      <table class="w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr class="bg-gray-200 text-left">
            <th class="p-3">Title</th>
            <th class="p-3">Price</th>
            <th class="p-3">Category</th>
            <th class="p-3">Description</th>
            <th class="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" class="border-t">
            <td class="p-3">{{ product.title }}</td>
            <td class="p-3">${{ product.price }}</td>
            <td class="p-3">{{ product.category }}</td>
            <td class="p-3">{{ product.description }}</td>
            <td class="p-3 w-1/5">
              <button
                @click="editProductHandler(product)"
                class="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 mr-2"
              >
                Edit
              </button>
              <button
                @click="deleteProductHandler(product.id)"
                class="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
