'use client';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { fetchAdminProducts, fetchAdminJournal, fetchAdminPricing, fetchAdminCategories, fetchAdminBanners, fetchCategoryTree } from '@/lib/api';

export default function DataProvider() {
  const setAdminProducts   = useStore(s => s.setAdminProducts);
  const setAdminJournal    = useStore(s => s.setAdminJournal);
  const setGoldRate        = useStore(s => s.setGoldRate);
  const setSilverRate      = useStore(s => s.setSilverRate);
  const setPlatinumRate    = useStore(s => s.setPlatinumRate);
  const setAdminCategories = useStore(s => s.setAdminCategories);
  const setAdminBanners    = useStore(s => s.setAdminBanners);
  const setCategoryTree    = useStore(s => s.setCategoryTree);

  useEffect(() => {
    fetchAdminProducts().then(ps   => setAdminProducts(ps));
    fetchAdminJournal().then(js    => setAdminJournal(js));
    fetchAdminPricing().then(pr    => {
      if (pr?.goldRate24k) setGoldRate(pr.goldRate24k);
      if (pr?.silverRate) setSilverRate(pr.silverRate);
      if (pr?.platinumRate) setPlatinumRate(pr.platinumRate);
    });
    fetchAdminCategories().then(cs => setAdminCategories(cs));
    fetchAdminBanners().then(bs    => setAdminBanners(bs));
    fetchCategoryTree().then(t     => setCategoryTree(t));
  }, [setAdminProducts, setAdminJournal, setGoldRate, setSilverRate, setPlatinumRate, setAdminCategories, setAdminBanners, setCategoryTree]);

  return null;
}
