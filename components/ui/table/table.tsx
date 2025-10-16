import { JSX } from 'react';
import { THeadComponent } from '@/components/ui/table/thead/thead';
import { TBodyComponent } from '@/components/ui/table/tbody/tbody';
import { TableComponentProps } from '@/components/ui/table/table.props';
import { BaseRow } from '@/components/ui/table/tbody/tbody.props';

export function TableComponent<T extends BaseRow>({
  data,
  mapColumns,
  titleColumns,
  slug,
}: TableComponentProps<T>): JSX.Element {
  return (
    <table>
      <THeadComponent<T> mapColumns={mapColumns} titleColumns={titleColumns} />
      <TBodyComponent<T> data={data} mapColumns={mapColumns} slug={slug} />
    </table>
  );
}
