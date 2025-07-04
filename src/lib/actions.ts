'use server';

import { z } from 'zod';
import { db } from '@/lib/firebase';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

const FormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, { message: 'Must be a valid hex color.' }),
});

export type State = {
  errors?: {
    name?: string[];
    color?: string[];
  };
  message?: string | null;
};

export async function addColorEntry(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = FormSchema.safeParse({
    name: formData.get('name'),
    color: formData.get('color'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields. Failed to add color entry.',
    };
  }
  
  const { name, color } = validatedFields.data;

  try {
    await db.collection('colors').add({
      name,
      color,
      createdAt: FieldValue.serverTimestamp(),
    });

  } catch (error) {
    console.error(error);
    return { message: 'Database Error: Failed to add color entry.' };
  }
  
  revalidatePath('/');
  return { message: 'Added color entry.' };
}

export async function clearAllEntries() {
  try {
    const querySnapshot = await db.collection("colors").get();
    if (querySnapshot.empty) {
      return { message: "No entries to clear." };
    }
    const batch = db.batch();
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error(error);
    return { message: 'Database Error: Failed to clear entries.' };
  }

  revalidatePath('/');
  return { message: "Cleared all entries." };
}
