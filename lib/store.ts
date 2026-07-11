'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StorefrontProduct, AdminPost, AdminBanner, CategoryNode } from './api';
import { validatePromo } from './api';

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
    country: string;
  };
  deliveryMethod: string;
  payment: string;
  status: OrderStatus;
}

interface GlyaStore {
  user: { email: string } | null;
  setUser: (u: { email: string } | null) => void;

  goldRate: number;
  setGoldRate: (r: number) => void;
  silverRate: number;
  setSilverRate: (r: number) => void;
  platinumRate: number;
  setPlatinumRate: (r: number) => void;

  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'qty'>) => void;
  changeQty: (key: string, delta: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;

  wishlist: number[];
  toggleWish: (id: number) => void;

  coupon: string;
  setCoupon: (c: string) => void;
  couponApplied: { code: string; discount?: number; invalid?: boolean; error?: string } | null;
  applyCoupon: (orderTotal: number) => Promise<void>;
  clearCoupon: () => void;

  giftWrap: boolean;
  toggleGiftWrap: () => void;
  insurance: boolean;
  toggleInsurance: () => void;

  lastOrder: string;
  setLastOrder: (no: string) => void;

  orders: Order[];
  addOrder: (o: Order) => void;
  updateOrderStatus: (orderNo: string, status: OrderStatus) => void;
  mergeOrders: (incoming: Order[]) => void;

  stock: Record<number, number>;
  setStock: (id: number, qty: number) => void;
  decrementStock: (lines: OrderLine[]) => void;

  adminProducts: StorefrontProduct[];
  productsLoaded: boolean;
  setAdminProducts: (products: StorefrontProduct[]) => void;

  adminJournal: AdminPost[];
  journalLoaded: boolean;
  setAdminJournal: (posts: AdminPost[]) => void;

  adminCategories: string[];
  setAdminCategories: (cats: string[]) => void;

  categoryTree: CategoryNode[];
  setCategoryTree: (tree: CategoryNode[]) => void;

  adminBanners: AdminBanner[];
  bannersLoaded: boolean;
  setAdminBanners: (banners: AdminBanner[]) => void;
}

export const useStore = create<GlyaStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (u) => set({ user: u }),

      goldRate: 7180,
      setGoldRate: (r) => set({ goldRate: r }),
      silverRate: 94,
      setSilverRate: (r) => set({ silverRate: r }),
      platinumRate: 3380,
      setPlatinumRate: (r) => set({ platinumRate: r }),

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
      applyCoupon: async (orderTotal) => {
        const c = get().coupon.trim().toUpperCase();
        if (!c) { set({ couponApplied: null }); return; }
        const res = await validatePromo(c, orderTotal);
        if (res.valid) set({ couponApplied: { code: res.code || c, discount: res.discount ?? 0 } });
        else set({ couponApplied: { code: c, invalid: true, error: res.error } });
      },
      clearCoupon: () => set({ coupon: '', couponApplied: null }),

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
      mergeOrders: (incoming) => set(s => {
        const map = new Map(s.orders.map(o => [o.orderNo, o]));
        for (const o of incoming) {
          if (map.has(o.orderNo)) {
            map.set(o.orderNo, { ...map.get(o.orderNo)!, status: o.status });
          } else {
            map.set(o.orderNo, o);
          }
        }
        return {
          orders: Array.from(map.values())
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        };
      }),

      stock: {},
      setStock: (id, qty) => set(s => ({ stock: { ...s.stock, [id]: Math.max(0, qty) } })),
      decrementStock: (lines) => set(s => {
        const ns = { ...s.stock };
        lines.forEach(l => { ns[l.productId] = Math.max(0, (ns[l.productId] ?? 5) - l.qty); });
        return { stock: ns };
      }),

      adminProducts: [],
      productsLoaded: false,
      setAdminProducts: (products) => set({ adminProducts: products, productsLoaded: true }),

      adminJournal: [],
      journalLoaded: false,
      setAdminJournal: (posts) => set({ adminJournal: posts, journalLoaded: true }),

      adminCategories: [],
      setAdminCategories: (cats) => set({ adminCategories: cats }),

      categoryTree: [],
      setCategoryTree: (tree) => set({ categoryTree: tree }),

      adminBanners: [],
      bannersLoaded: false,
      setAdminBanners: (banners) => set({ adminBanners: banners, bannersLoaded: true }),
    }),
    {
      name: 'glya-store',
      partialize: (s) => ({
        user: s.user,
        cart: s.cart,
        wishlist: s.wishlist,
        lastOrder: s.lastOrder,
        orders: s.orders,
        stock: s.stock,
      }),
    }
  )
);

/** Live per-gram rates for every metal — pass straight into priceOf(). */
export function useMetalRates() {
  const gold     = useStore(s => s.goldRate);
  const silver   = useStore(s => s.silverRate);
  const platinum = useStore(s => s.platinumRate);
  return { gold, silver, platinum };
}
