'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ToolBox from '@/components/ToolBox';
import Product from '@/components/Product';
import axios from '@/commons/axios';
// import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Panel from '@/components/Panel';
import AddInventory from '@/components/AddInventory';
import { useAuth } from '@/context/AuthContext';

// 定義產品的類型
interface ProductType {
  id: number;
  name: string;
  price: number;
  mount: number;
}

const Products: React.FC = () => {
  const { user } = useAuth(); // 從 Context 獲取用戶數據
  const [products, setProducts] = useState<ProductType[]>([]);
  const [sourceProducts, setSourceProducts] = useState<ProductType[]>([]);
  const [cartNum, setCartNum] = useState<number>(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get('/products');
      setProducts(response.data);
      setSourceProducts(response.data);
    };

    fetchProducts();
    updateCartNum();
  }, []);

  const search = useCallback((text: string) => {
    const filteredProducts = sourceProducts.filter((p) =>
      p.name.match(new RegExp(text, 'gi'))
    );
    setProducts(filteredProducts);
  }, [sourceProducts]);

  const toAdd = useCallback(() => {
    Panel.open({
      component: AddInventory,
      callback: (data: ProductType) => {
        if (data) {
          add(data);
        }
      },
    });
  }, []);

  const add = useCallback((product: ProductType) => {
    setProducts((prevProducts) => [...prevProducts, product]);
    setSourceProducts((prevSourceProducts) => [...prevSourceProducts, product]);
  }, []);

  const update = useCallback((product: ProductType) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === product.id ? product : p))
    );
    setSourceProducts((prevSourceProducts) =>
      prevSourceProducts.map((p) => (p.id === product.id ? product : p))
    );
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
    setSourceProducts((prevSourceProducts) =>
      prevSourceProducts.filter((p) => p.id !== id)
    );
  }, []);

  const updateCartNum = useCallback(async () => {
    const cartNum = await initCartNum();
    setCartNum(cartNum);
  }, []);

  const initCartNum = useCallback(async (): Promise<number> => {
    if (!user) return 0; // 如果用戶未登錄，購物車數量為 0
    const res = await axios.get('/carts', {
      params: {
        userId: user.email,
      },
    });
    const carts = res.data || [];
    return carts.reduce((total: number, cart: { mount: number }) => total + cart.mount, 0);
  }, [user]);

  return (
    <div>
      <ToolBox search={search} cartNum={cartNum} />
      <div className="products">
        <div className="columns is-multiline is-desktop">
          {/* <TransitionGroup component={null}> */}
            {products.map((p) => (
              // <CSSTransition
              //   classNames="product-fade"
              //   timeout={300}
              //   key={p.id}
              // >
                <div className="column is-3">
                  <Product
                    product={p}
                    update={update}
                    delete={deleteProduct}
                    updateCartNum={updateCartNum}
                  />
                </div>
              // </CSSTransition>
            ))}
          {/* </TransitionGroup> */}
        </div>
        {user?.type === 1 && (
          <button
            className="button is-primary add-btn"
            onClick={toAdd}
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
};

export default Products;
