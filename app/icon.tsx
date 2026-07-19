import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: '#B08D57',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
      }}
    >
      <span style={{ color: '#F7F2E8', fontSize: 22, fontWeight: 700, fontFamily: 'serif' }}>
        G
      </span>
    </div>,
    { ...size },
  );
}
