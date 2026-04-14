'use cache';

import { JSX } from 'react';
import styles from './home-page.module.scss';
import { cacheLife, cacheTag } from 'next/cache';
import { CategorySection, getCatalog } from 'modules/client/catalog';

export default async function HomePage(): Promise<JSX.Element | null> {
  cacheLife('admin');
  cacheTag('client-pages', 'home');

  const catalog = await getCatalog();

  if (!catalog.ok) return null;

  return (
    <div className={styles.page}>
      {catalog.data.map(
        (item): JSX.Element => (
          <CategorySection key={item.category.id} category={item.category} products={item.products} />
        ),
      )}
    </div>
  );
}
