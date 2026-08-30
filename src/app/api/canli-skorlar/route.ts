import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { canliSkorlariGuncelle } from '@/services/scraper-bot';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hafta = parseInt(searchParams.get('hafta') || '35');
    const refresh = searchParams.get('refresh') === 'true';

    if (refresh) {
      await canliSkorlariGuncelle();
    }

    const maclar = await prisma.canliMac.findMany({
      where: { hafta },
      orderBy: { macNo: 'asc' },
    });

    return NextResponse.json({
      hafta,
      maclar,
      sonGuncelleme: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Canli skorlar API hatası:', error);
    return NextResponse.json({ error: 'Canlı skorlar alınamadı.' }, { status: 500 });
  }
}
