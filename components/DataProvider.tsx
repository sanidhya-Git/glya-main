'use client';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { fetchAdminProducts, fetchAdminJournal, fetchAdminCategories, fetchAdminBanners, fetchCategoryTree, fetchFeaturedCategories } from '@/lib/api';
import { swrList } from '@/lib/dataCache';

/* Metal rates are handled by GoldRateProvider (always rendered alongside this)
   — no pricing fetch here, it would be a duplicate request on every load. */
export default function DataProvider() {
  const setAdminProducts   = useStore(s => s.setAdminProducts);
  const setAdminJournal    = useStore(s => s.setAdminJournal);
  const setAdminCategories = useStore(s => s.setAdminCategories);
  const setAdminBanners    = useStore(s => s.setAdminBanners);
  const setCategoryTree    = useStore(s => s.setCategoryTree);
  const setFeaturedCats    = useStore(s => s.setFeaturedCats);

  useEffect(() => {
    swrList('products',      fetchAdminProducts,       setAdminProducts);
    swrList('journal',       fetchAdminJournal,        setAdminJournal);
    swrList('categories',    fetchAdminCategories,     setAdminCategories);
    swrList('banners',       fetchAdminBanners,        setAdminBanners);
    swrList('cat-tree',      fetchCategoryTree,        setCategoryTree);
    swrList('featured-cats', fetchFeaturedCategories,  setFeaturedCats);
  }, [setAdminProducts, setAdminJournal, setAdminCategories, setAdminBanners, setCategoryTree, setFeaturedCats]);

  return null;
}
