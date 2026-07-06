'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StorefrontProduct, AdminPost } from './api';

export interface CartItem {
  key: string;
  id: number;
  karat: string;
  size: string | null;
  engraving: string;
  qty: number;
}

export interface OrderLine {
  productId: number;
  name: string;
  karat: string;
  metal: string;
  size: string | null;
  engraving: string;
  qty: number;
  unitPrice: number;
}

export type OrderStatus = 'Confirmed' | 'Processing' | 'Dispatched' | 'In transit' | 'Delivered' | 'Cancelled';

export interface Order {
  orderNo: string;
  date: string;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  deliveryCost: number;
  giftWrapCost: number;
  insuranceCost: number;
  total: number;
  couponCode: string;
  address: {
    firstName: string;
    lastName: string;
    mobile: string;
    line1: string;
    line2: string;
    pincode: string;
    city: string;
    state: string;
  };
  deliveryMethod: string;
  payment: string;
  status: OrderStatus;
}

interface GlyaStore {
  goldRate: number;
  setGoldRate: (r: number) => void;

  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'qty'>) => void;
  changeQty: (key: string, delta: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;

  wishlist: number[];
  toggleWish: (id: number) => void;

  coupon: string;
  setCoupon: (c: string) => void;
  couponApplied: { code: string; type?: string; amount?: number; invalid?: boolean } | null;
  applyCoupon: () => void;

  giftWrap: boolean;
  toggleGiftWrap: () => void;
  insurance: boolean;
  toggleInsurance: () => void;

  lastOrder: string;
  setLastOrder: (no: string) => void;

  orders: Order[];
  addOrder: (o: Order) => void;
  updateOrderStatus: (orderNo: string, status: OrderStatus) => void;

  stock: Record<number, number>;
  setStock: (id: number, qty: number) => void;
  decrementStock: (lines: OrderLine[]) => void;

  adminProducts: StorefrontProduct[];
  setAdminProducts: (products: StorefrontProduct[]) => void;

  adminJournal: AdminPost[];
  setAdminJournal: (posts: AdminPost[]) => void;

  adminCategories: string[];
  setAdminCategories: (cats: string[]) => void;
}

export const useStore = create<GlyaStore>()(
  persist(
    (set, get) => ({
      goldRate: 7180,
      setGoldRate: (r) => set({ goldRate: r }),

      cart: [],
      addToCart: (item) => {
        const { cart } = get();
        const existing = cart.find(i => i.key === item.key);
        if (existing) {
          set({ cart: cart.map(i => i.key === item.key ? { ...i, qty: i.qty + 1 } : i) });
        } else {
          set({ cart: [...cart, { ...item, qty: 1 }] });
        }
      },
      changeQty: (key, delta) => set(s => ({
        cart: s.cart.map(i => i.key === key ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
      })),
      removeItem: (key) => set(s => ({ cart: s.cart.filter(i => i.key !== key) })),
      clearCart: () => set({ cart: [], couponApplied: null, giftWrap: false, insurance: false }),

      wishlist: [],
      toggleWish: (id) => set(s => ({
        wishlist: s.wishlist.includes(id) ? s.wishlist.filter(x => x !== id) : [...s.wishlist, id]
      })),

      coupon: '',
      setCoupon: (c) => set({ coupon: c }),
      couponApplied: null,
      applyCoupon: () => {
        const c = get().coupon.trim().toUpperCase();
        if (!c) { set({ couponApplied: null }); return; }
        if (c === 'GLYA10') set({ couponApplied: { code: c, type: 'pct' } });
        else if (c === 'WELCOME') set({ couponApplied: { code: c, amount: 5000 } });
        else set({ couponApplied: { code: c, invalid: true } });
      },

      giftWrap: false,
      toggleGiftWrap: () => set(s => ({ giftWrap: !s.giftWrap })),
      insurance: false,
      toggleInsurance: () => set(s => ({ insurance: !s.insurance })),

      lastOrder: '',
      setLastOrder: (no) => set({ lastOrder: no }),

      orders: [],
      addOrder: (o) => set(s => ({ orders: [o, ...s.orders] })),
      updateOrderStatus: (orderNo, status) => set(s => ({
        orders: s.orders.map(o => o.orderNo === orderNo ? { ...o, status } : o)
      })),

      stock: {},
      setStock: (id, qty) => set(s => ({ stock: { ...s.stock, [id]: Math.max(0, qty) } })),
      decrementStock: (lines) => set(s => {
        const ns = { ...s.stock };
        lines.forEach(l => { ns[l.productId] = Math.max(0, (ns[l.productId] ?? 5) - l.qty); });
        return { stock: ns };
      }),

      adminProducts: [],
      setAdminProducts: (products) => set({ adminProducts: products }),

      adminJournal: [],
      setAdminJournal: (posts) => set({ adminJournal: posts }),

      adminCategories: [],
      setAdminCategories: (cats) => set({ adminCategories: cats }),
    }),
    {
      name: 'glya-store',
      partialize: (s) => ({
        cart: s.cart,
        wishlist: s.wishlist,
        lastOrder: s.lastOrder,
        orders: s.orders,
        stock: s.stock,
      }),
    }
  )
);
