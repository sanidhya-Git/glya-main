'use client';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { fetchAdminProducts, fetchAdminJournal, fetchAdminPricing } from '@/lib/api';

export default function DataProvider() {
  const setAdminProducts = useStore(s => s.setAdminProducts);
  const setAdminJournal  = useStore(s => s.setAdminJournal);
  const setGoldRate      = useStore(s => s.setGoldRate);

  useEffect(() => {
    fetchAdminProducts().then(ps => { if (ps.length > 0) setAdminProducts(ps); });
    fetchAdminJournal().then(js  => { if (js.length > 0) setAdminJournal(js); });
    fetchAdminPricing().then(pr  => { if (pr?.goldRate24k) setGoldRate(pr.goldRate24k); });
  }, [setAdminProducts, setAdminJournal, setGoldRate]);

  return null;
}
