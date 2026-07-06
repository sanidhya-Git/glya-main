import { redirect } from 'next/navigation';
// Route resolution: app/page.tsx handles / — this file defers to it.
export default function StorePage() { redirect('/browse'); }
