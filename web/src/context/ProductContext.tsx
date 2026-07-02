import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data';

interface ProductContextType {
  products: Product[];
  loading: boolean;
}

const ProductContext = createContext<ProductContextType>({
  products: FALLBACK_PRODUCTS,
  loading: false,
});

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          // Map DB keys to frontend keys if needed
          const mappedData = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: `$${p.price.toFixed(2)}`,
            priceNum: p.price,
            image: p.image,
            category: p.category,
            description: p.description,
            badge: p.status === 'Active' ? undefined : (p.status === 'Low Stock' ? 'LOW STOCK' : 'OUT OF STOCK'),
            details: [], // DB doesn't have details array, using empty
            specs: {
              material: "Premium Material",
              fit: "Athletic Fit",
              care: "Standard Care"
            }
          }));
          setProducts(mappedData);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
