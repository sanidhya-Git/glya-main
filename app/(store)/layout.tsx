import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GoldRateProvider from '@/components/GoldRateProvider';
import DataProvider from '@/components/DataProvider';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoldRateProvider />
      <DataProvider />
      <Header />
      {children}
      <Footer />
    </>
  );
}
