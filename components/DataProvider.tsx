'use client';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { fetchAdminProducts, fetchAdminJournal, fetchAdminPricing, fetchAdminCategories } from '@/lib/api';

export default function DataProvider() {
  const setAdminProducts   = useStore(s => s.setAdminProducts);
  const setAdminJournal    = useStore(s => s.setAdminJournal);
  const setGoldRate        = useStore(s => s.setGoldRate);
  const setAdminCategories = useStore(s => s.setAdminCategories);

  useEffect(() => {
    fetchAdminProducts().then(ps   => { if (ps.length > 0)   setAdminProducts(ps); });
    fetchAdminJournal().then(js    => { if (js.length > 0)   setAdminJournal(js); });
    fetchAdminPricing().then(pr    => { if (pr?.goldRate24k) setGoldRate(pr.goldRate24k); });
    fetchAdminCategories().then(cs => { if (cs.length > 0)   setAdminCategories(cs); });
  }, [setAdminProducts, setAdminJournal, setGoldRate, setAdminCategories]);

  return null;
}
