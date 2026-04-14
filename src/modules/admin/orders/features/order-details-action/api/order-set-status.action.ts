'use server';

import { revalidatePath } from 'next/cache';
import { OrderStatus } from 'modules/admin/orders/entities';
import { ordersRepo } from 'modules/admin/orders/repository';

export const setStatusOrderAction = async (id: number, status: OrderStatus): Promise<{ success: true }> => {
  await ordersRepo.updateStatus(id, status);

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath('/admin/orders');

  return { success: true };
};
