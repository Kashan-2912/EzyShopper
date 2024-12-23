import {create} from "zustand";
import axios from "../lib/axios";
import {toast} from "react-hot-toast";

export const useProductStore = create((set) => ({
    products: [],
    loading: false,

    setProducts: (products) => set({products}),

    // functions
    createProduct: async (productData) => {
        set({loading: true})
        try {
            const res = await axios.post("/products", productData)
            set((prevState) => ({
                products: [...prevState.products, res.data],
                loading: false
            }))
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occured during product creation.")
            set({loading: false})
        }
    },

    fetchAllProducts: async () => {
        set({loading: true})
        try {
            const res = await axios.get("/products")
            set({products: res.data.products, loading: false})
        } catch (error) {
            set({error: "Failed to fetch products!", loading: false})
            toast.error(error.response?.data?.message || "Failed to fetch products!")
        }
    },

    deleteProduct: async (productId) => {
        set({loading: true})
        try {
            await axios.delete(`/products/${productId}`)
            set((prevProducts) => ({
                products: prevProducts.products.filter((product) => product._id !== productId),
                loading: false
            }))
        } catch (error) {
            set({loading: false})
            toast.error(error.response?.data?.message || "Failed to delete product.")
        }
    },

    toggleFeaturedProduct: async (productId) => {
        set({loading: true})
        try {
            const res = await axios.patch(`/products/${productId}`);

            // this will update the isFeatured prop of the product
            set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: res.data.isFeatured } : product
				),
				loading: false,
			}));
        } catch (error) {
            set({loading: false})
            toast.error(error.response?.data?.message || "Failed to update product.")
        }
    },

    fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			console.log("Error fetching featured products:", error);
		}
	},

    fetchProductsByCategory: async(category) => {
        set({loading: true})
        try {
            const res = await axios.get(`/products/category/${category}`);
            set({products: res.data.products, loading: false})
        } catch (error) {
            set({loading: false})
            toast.error(error.response?.data?.message || "Failed to fetch products.")
        }
    },
}))