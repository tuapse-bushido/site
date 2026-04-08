'use server';
import { revalidatePath } from 'next/cache';

export async function revalidateOrders(): Promise<void> {
  revalidatePath('/admin/orders', 'layout');
}
