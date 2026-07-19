import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'GLYA — Sree Sai Jewellers | Fine Gold & Diamond Jewellery';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        background: '#211C17',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'serif',
        position: 'relative',
      }}
    >
      {/* Gold radial glow */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 400,
          background: 'radial-gradient(ellipse, rgba(176,141,87,0.18) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      {/* Tagline */}
      <div
        style={{
          fontSize: 13,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: '#B08D57',
          marginBottom: 20,
          display: 'flex',
        }}
      >
        EST. 2019 · KOREGAON PARK, PUNE
      </div>
      {/* Brand mark */}
      <div
        style={{
          fontSize: 90,
          letterSpacing: '0.34em',
          paddingLeft: '0.34em',
          color: '#EDE6D8',
          fontWeight: 700,
          display: 'flex',
        }}
      >
        GLYA
      </div>
      {/* Divider */}
      <div
        style={{
          width: 80,
          height: 1,
          background: '#B08D57',
          margin: '24px 0',
          display: 'flex',
        }}
      />
      {/* Sub */}
      <div
        style={{
          fontSize: 22,
          color: '#9E958A',
          letterSpacing: '0.08em',
          display: 'flex',
        }}
      >
        Sree Sai Jewellers — Fine Gold &amp; Diamond Jewellery
      </div>
      {/* Trust badges */}
      <div
        style={{
          display: 'flex',
          gap: 32,
          marginTop: 32,
          fontSize: 12,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(237,230,216,0.5)',
        }}
      >
        <span>BIS Hallmarked</span>
        <span style={{ color: '#B08D57' }}>·</span>
        <span>IGI / GIA Certified</span>
        <span style={{ color: '#B08D57' }}>·</span>
        <span>Lifetime Exchange</span>
      </div>
    </div>,
    { ...size },
  );
}
