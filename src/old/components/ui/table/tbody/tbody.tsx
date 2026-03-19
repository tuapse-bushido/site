'use client';

import { JSX } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/utils';
import { BaseRow, TBodyComponentProps } from '@/components/ui/table/tbody/tbody.props';
import { useRouter } from 'next/navigation';
import styles from './tbody.module.scss';
import clsx from 'clsx';

export function TBodyComponent<T extends BaseRow>({ data, mapColumns, slug }: TBodyComponentProps<T>): JSX.Element {
  const router = useRouter();

  return (
    <tbody>
      {data.map((item): JSX.Element => {
        const handlerClickRow = (): void => {
          router.push(`/admin/menu/${slug}/${item.id}`);
        };

        return (
          <tr key={item.id} onClick={handlerClickRow} className={styles.tr}>
            {mapColumns.map((title): JSX.Element => {
              const value = item[title];

              const imageSrc = typeof value === 'string' && value.trim() !== '' ? getImageUrl(value) : '';

              if (title === 'image_link') {
                return (
                  <td key={title} className={clsx(styles.td, styles.imageWrapper)}>
                    <Image
                      className={styles.image}
                      src={imageSrc}
                      alt={item['title'] ? item['title'] : ''}
                      width={100}
                      height={75}
                    />
                  </td>
                );
              }

              if (title === 'is_visible') {
                return item[title] ? (
                  <td key={title} className={styles.td}>
                    Видимый
                  </td>
                ) : (
                  <td key={title} className={styles.td}>
                    Невидимый
                  </td>
                );
              }

              if (title === 'is_active') {
                return item[title] ? (
                  <td key={title} className={styles.td}>
                    Доступно
                  </td>
                ) : (
                  <td key={title} className={styles.td}>
                    Недоступно
                  </td>
                );
              }

              if (title === 'is_set') {
                return item[title] ? (
                  <td key={title} className={styles.td}>
                    Сет
                  </td>
                ) : (
                  <td key={title} className={styles.td}>
                    Самостоятельное
                  </td>
                );
              }

              return (
                <td key={title as string} className={styles.td}>
                  {String(item[title])}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}
