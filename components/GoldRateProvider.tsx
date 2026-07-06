'use client';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { fetchAdminPricing } from '@/lib/api';

export default function GoldRateProvider() {
  const setGoldRate = useStore(s => s.setGoldRate);

  useEffect(() => {
    // Fetch real gold rate from admin on mount and every 5 minutes
    async function refresh() {
      const pricing = await fetchAdminPricing();
      if (pricing?.goldRate24k) {
        setGoldRate(pricing.goldRate24k);
      }
    }

    refresh();
    const interval = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [setGoldRate]);

  return null;
}
