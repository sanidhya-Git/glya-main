'use client';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { fetchAdminPricing } from '@/lib/api';

export default function GoldRateProvider() {
  const setGoldRate     = useStore(s => s.setGoldRate);
  const setSilverRate   = useStore(s => s.setSilverRate);
  const setPlatinumRate = useStore(s => s.setPlatinumRate);

  useEffect(() => {
    // Fetch real metal rates from admin on mount and every 5 minutes
    async function refresh() {
      const pricing = await fetchAdminPricing();
      if (pricing?.goldRate24k) setGoldRate(pricing.goldRate24k);
      if (pricing?.silverRate) setSilverRate(pricing.silverRate);
      if (pricing?.platinumRate) setPlatinumRate(pricing.platinumRate);
    }

    refresh();
    const interval = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [setGoldRate, setSilverRate, setPlatinumRate]);

  return null;
}
