'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ToolBox from '@/components/ToolBox';
import Product from '@/components/Product';
import Panel from '@/components/Panel';
import AddInventory from '@/components/AddInventory';
import { auth } from '@/commons/auth';

// 定義產品類型
interface ProductType {
  id: number;
  name: string;
  price: number;
  mount: number;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [sourceProducts, setSourceProducts] = useState<ProductType[]>([]);
  const [cartNum, setCartNum] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // 加載產品數據
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          cache: 'no-store',
        });
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
        setSourceProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error');
      }
    };

    const fetchCartNum = async () => {
      try {
        const user = auth.getUser();
        if (!user?.email) return;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts?userId=${user.email}`);
        if (!response.ok) throw new Error('Failed to fetch cart data');
        const carts = await response.json();
        const num = carts.reduce((acc: number, cart: { mount: number }) => acc + cart.mount, 0);
        setCartNum(num);
      } catch (err) {
        console.error('Error fetching cart number:', err);
      }
    };

    fetchProducts();
    fetchCartNum();
  }, []);

  // 搜索功能
  const search = useCallback((text: string) => {
    const filteredProducts = sourceProducts.filter((p) =>
      p.name.toLowerCase().includes(text.toLowerCase())
    );
    setProducts(filteredProducts);
  }, [sourceProducts]);

  // 添加產品
  const toAdd = useCallback(() => {
    Panel.open({
      component: AddInventory,
      callback: (data: ProductType) => {
        if (data) add(data);
      },
    });
  }, []);

  const add = useCallback((product: ProductType) => {
    setProducts((prev) => [...prev, product]);
    setSourceProducts((prev) => [...prev, product]);
  }, []);

  // 更新產品
  const update = useCallback((product: ProductType) => {
    const updateList = (list: ProductType[]) =>
      list.map((p) => (p.id === product.id ? product : p));
    setProducts(updateList);
    setSourceProducts(updateList);
  }, []);

  // 刪除產品
  const deleteProduct = useCallback((id: number) => {
    const filterList = (list: ProductType[]) => list.filter((p) => p.id !== id);
    setProducts(filterList);
    setSourceProducts(filterList);
  }, []);

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <ToolBox search={search} cartNum={cartNum} />
      <div className="products">
        <div className="columns is-multiline is-desktop">
          {products.map((p) => (
            <div className="column is-3" key={p.id}>
              <Product
                product={p}
                update={update}
                delete={deleteProduct}
                updateCartNum={() => setCartNum(cartNum + 1)}
              />
            </div>
          ))}
        </div>
        {(auth.getUser() || {}).type === 1 && (
          <button className="button is-primary add-btn" onClick={toAdd}>
            Add
          </button>
        )}
      </div>
    </div>
  );
};

export default Products;
