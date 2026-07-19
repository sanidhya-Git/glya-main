import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GLYA — Sree Sai Jewellers',
    short_name: 'GLYA',
    description: 'Certified 22K gold & diamond jewellery from Sree Sai Jewellers, Pune. BIS Hallmarked, IGI/GIA certified.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F2E8',
    theme_color: '#B08D57',
    orientation: 'portrait-primary',
    lang: 'en-IN',
    categories: ['shopping', 'lifestyle'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    screenshots: [
      {
        src: '/screenshots/home.jpg',
        sizes: '1280x720',
        type: 'image/jpeg',
        // @ts-expect-error — form_factor is valid but not typed in older @types/next
        form_factor: 'wide',
        label: 'GLYA Fine Jewellery — Home',
      },
    ],
  };
}
