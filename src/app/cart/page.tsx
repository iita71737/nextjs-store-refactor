import React, { useContext, useState, useEffect, useMemo } from 'react';
import Layout from 'Layout';
import CartItem from 'components/CartItem';
import { formatPrice } from 'commons/helper';
import axios from '@/commons/axios';
// import { AuthContext } from 'contexts/AuthContext';
import { NextPage } from 'next';
import { auth } from '@/commons/auth';

const Cart: NextPage = () => {
    // const { user } = useContext(AuthContext);
    const [carts, setCarts] = useState([]);

    useEffect(() => {
        const user = auth.getUser() || {};
        if (user && user.email) {
            axios.get(`/carts?userId=${user.email}`).then(res => setCarts(res.data));
        }
    }, []);

    const totalPrice = useMemo(() => {
        const totalPrice = carts
            .map(cart => cart.mount * parseInt(cart.price, 10))
            .reduce((a, value) => a + value, 0);
        return formatPrice(totalPrice);
    }, [carts]);

    const updateCart = (cart: any) => {
        const newCarts = [...carts];
        const _index = newCarts.findIndex(c => c.id === cart.id);
        newCarts.splice(_index, 1, cart);
        setCarts(newCarts);
    };

    const deleteCart = (cart: any) => {
        const _carts = carts.filter(c => c.id !== cart.id);
        setCarts(_carts);
    };

    return (
        <Layout>
            <div className="cart-page">
                <span className="cart-title">Shopping Cart</span>
                <div className="cart-list">
                    {carts.map(cart => (
                        <CartItem
                            key={cart.id}
                            cart={cart}
                            updateCart={updateCart}
                            deleteCart={deleteCart}
                        />
                    ))}
                </div>
                {carts.length === 0 ? <p className="no-cart">NO GOODS</p> : ''}
                <div className="cart-total">
                    Total:
                    <span className="total-price">{totalPrice}</span>
                </div>
            </div>
        </Layout>
    );
};

export default Cart;
