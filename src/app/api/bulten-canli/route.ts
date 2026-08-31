import { NextRequest, NextResponse } from 'next/server';
import { getCanliBultenVeSkorlar } from '@/services/live-sync-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const data = await getCanliBultenVeSkorlar();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: 'Canlı bülten alınamadı' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await getCanliBultenVeSkorlar();
    return NextResponse.json({ ...data, message: 'Bülten ve canlı skorlar başarıyla senkronize edildi!' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Senkronizasyon hatası' }, { status: 500 });
  }
}
