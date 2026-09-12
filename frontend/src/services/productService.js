import api from "./api";

export async function fetchProducts(category) {
  const { data } = await api.get("/products", { params: category ? { category } : {} });
  return data.products;
}

export async function fetchProductById(id) {
  const { data } = await api.get(`/products/${id}`);
  return data.product;
}
