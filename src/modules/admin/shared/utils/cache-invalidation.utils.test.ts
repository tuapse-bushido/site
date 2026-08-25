import { beforeEach, describe, expect, it, vi } from 'vitest';

const { updateTagMock } = vi.hoisted((): { updateTagMock: ReturnType<typeof vi.fn> } => ({
  updateTagMock: vi.fn(),
}));

vi.mock('next/cache', (): { updateTag: typeof updateTagMock } => ({
  updateTag: updateTagMock,
}));

import {
  invalidateAddonRuleCache,
  invalidateCategoryCache,
  invalidateIngredientCache,
  invalidateProductCache,
} from './cache-invalidation.utils';

describe('cache invalidation', (): void => {
  beforeEach((): void => {
    updateTagMock.mockClear();
  });

  it('invalidates product dependencies', (): void => {
    invalidateProductCache();

    expect(updateTagMock.mock.calls.flat()).toEqual([
      'addon-rules',
      'admin-pages',
      'products',
      'catalog',
      'client-pages',
    ]);
  });

  it('invalidates category dependencies', (): void => {
    invalidateCategoryCache();

    expect(updateTagMock.mock.calls.flat()).toEqual([
      'categories',
      'addon-rules',
      'admin-pages',
      'products',
      'catalog',
      'client-pages',
    ]);
  });

  it('invalidates ingredient dependencies', (): void => {
    invalidateIngredientCache();

    expect(updateTagMock.mock.calls.flat()).toEqual([
      'ingredients',
      'admin-pages',
      'products',
      'catalog',
      'client-pages',
    ]);
  });

  it('invalidates addon rule dependencies', (): void => {
    invalidateAddonRuleCache();

    expect(updateTagMock.mock.calls.flat()).toEqual([
      'addon-rules',
      'admin-pages',
      'products',
      'catalog',
      'client-pages',
    ]);
  });
});
