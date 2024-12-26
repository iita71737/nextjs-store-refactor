'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/commons/helper';
import Panel from '@/components/Panel';
import EditInventory from '@/components/EditInventory';
import axios from '@/commons/axios';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';

interface ProductProps {
  product: {
    id: number;
    name: string;
    image: string;
    price: number;
    tags: string;
    status: 'available' | 'unavailable';
  };
  delete: (id: number) => void;
  update: (product: any) => void;
  updateCartNum: () => void;
}

const Product: React.FC<ProductProps> = ({ product, delete: deleteProduct, update, updateCartNum }) => {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth(); // 使用 Context 獲取用戶數據

  const toEdit = useCallback(() => {
    if (user?.type !== 1) return;

    Panel.open({
      component: EditInventory,
      props: {
        product,
        deleteProduct,
      },
      callback: (data: any) => {
        if (data) {
          update(data);
        }
      },
    });
  }, [user, product, deleteProduct, update]);

  const addCart = useCallback(async () => {
    if (!isLoggedIn) {
      router.push('/login');
      toast.info('Please Login First');
      return;
    }

    try {
      const { id, name, image, price } = product;
      const res = await axios.get(`/carts?productId=${id}`);
      const carts = res.data;

      if (carts && carts.length > 0) {
        const cart = carts[0];
        cart.mount += 1;
        await axios.put(`/carts/${cart.id}`, cart);
      } else {
        const cart = {
          productId: id,
          name,
          image,
          price,
          mount: 1,
          userId: user!.email,
        };
        await axios.post('/carts', cart);
      }

      toast.success('Add Cart Success');
      updateCartNum();
    } catch (error) {
      toast.error('Add Cart Failed');
    }
  }, [isLoggedIn, user, product, updateCartNum, router]);

  const renderManagerBtn = useCallback(() => {
    if (user?.type === 1) {
      return (
        <div className="p-head has-text-right" onClick={toEdit}>
          <span className="icon edit-btn">
            <i className="fas fa-sliders-h"></i>
          </span>
        </div>
      );
    }
  }, [user, toEdit]);

  const { name, image, tags, price, status } = product;
  const productClass = status === 'available' ? 'product' : 'product out-stock';

  return (
    <div className={productClass}>
      <div className="p-content">
        {renderManagerBtn()}
        <div className="img-wrapper">
          <div className="out-stock-text">Out Of Stock</div>
          <figure className="image is-4by3">
            <img src={image} alt={name} />
          </figure>
        </div>
        <p className="p-tags">{tags}</p>
        <p className="p-name">{name}</p>
      </div>
      <div className="p-footer">
        <p className="price">{formatPrice(price)}</p>
        <button
          className="add-cart"
          disabled={status === 'unavailable'}
          onClick={addCart}
        >
          <i className="fas fa-shopping-cart"></i>
          <i className="fas fa-exclamation"></i>
        </button>
      </div>
    </div>
  );
};

export default Product;
