import { JSX } from 'react';
import { THeadComponentProps } from '@/components/ui/table/thead/thead.props';
import styles from './thead.module.scss';

export function THeadComponent<T>({ mapColumns, titleColumns }: THeadComponentProps<T>): JSX.Element {
  return (
    <thead>
      <tr>
        {mapColumns.map((title): JSX.Element => {
          return (
            <th key={title as string} className={styles.th}>
              {titleColumns[title]}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
