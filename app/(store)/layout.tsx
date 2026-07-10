import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GoldRateProvider from '@/components/GoldRateProvider';
import DataProvider from '@/components/DataProvider';
import SiteLoader from '@/components/SiteLoader';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteLoader />
      <GoldRateProvider />
      <DataProvider />
      <Header />
      {children}
      <Footer />
    </>
  );
}
