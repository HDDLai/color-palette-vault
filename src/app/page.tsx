import { Timestamp } from 'firebase-admin/firestore';
import { db } from '@/lib/firebase';
import { ColorForm } from '@/components/color-form';
import { ColorList } from '@/components/color-list';
import { Separator } from '@/components/ui/separator';
import type { ColorEntry } from '@/lib/types';

async function getColors() {
  const colorSnapshot = await db.collection('colors').get();
  const colorList = colorSnapshot.docs.map(doc => {
    const data = doc.data();
    const createdAt = (data.createdAt as Timestamp)?.toDate() ?? new Date(0);
    return {
      id: doc.id,
      name: data.name,
      color: data.color,
      createdAt: createdAt.toISOString(),
    } as ColorEntry;
  });

  colorList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return colorList;
}

export default async function Home() {
  const entries = await getColors();

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight font-headline">Color Palette Vault</h1>
        <p className="mt-2 text-muted-foreground">
          Save names and favorite colors.
        </p>
      </header>

      <main className="space-y-8">
        <div className="border p-4 md:p-6">
          <ColorForm />
        </div>
        <Separator />
        <ColorList entries={entries} />
      </main>
    </div>
  );
}
