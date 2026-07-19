import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        background: '#B08D57',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 36,
      }}
    >
      <span style={{ color: '#F7F2E8', fontSize: 120, fontWeight: 700, fontFamily: 'serif' }}>
        G
      </span>
    </div>,
    { ...size },
  );
}
