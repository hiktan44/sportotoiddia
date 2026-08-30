import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Giriş yapmanız gerekiyor.' }, { status: 401 });
    }

    const kuponlar = await prisma.kupon.findMany({
      where: { userId: auth.userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ kuponlar });
  } catch (error: any) {
    console.error('Kuponlar list error:', error);
    return NextResponse.json({ error: 'Kuponlar yüklenemedi.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Kupon kaydetmek için lütfen giriş yapın.' }, { status: 401 });
    }

    const body = await req.json();
    const { title, hafta, maclar, secilenKolonlar, aktifFormul, toplamKolon, maliyet } = body;

    const kupon = await prisma.kupon.create({
      data: {
        userId: auth.userId,
        title: title || 'Spor Toto Kuponu',
        hafta: hafta || 35,
        maclar,
        secilenKolonlar,
        aktifFormul,
        toplamKolon,
        maliyet,
      },
    });

    return NextResponse.json({ kupon, message: 'Kupon buluta başarıyla kaydedildi!' });
  } catch (error: any) {
    console.error('Kupon save error:', error);
    return NextResponse.json({ error: 'Kupon kaydedilemedi.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) {
      return NextResponse.json({ error: 'Yetkiniz yok.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Kupon ID gerekli.' }, { status: 400 });
    }

    await prisma.kupon.deleteMany({
      where: { id, userId: auth.userId },
    });

    return NextResponse.json({ message: 'Kupon silindi.' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Kupon silinemedi.' }, { status: 500 });
  }
}
