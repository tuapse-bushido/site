import { JSX } from 'react';
import { AddButton } from './add-button';
import { SearchField } from './search-field';
import { MuiStack } from 'modules/admin/shared/ui/mui';

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  addHref?: string;
  addTitle?: string;
};

export const EntityToolbar = ({ search, onSearchChange, addHref, addTitle }: Props): JSX.Element => {
  return (
    <MuiStack direction="row" gap={2}>
      <SearchField value={search} onChange={onSearchChange} />

      {addHref && addTitle && <AddButton href={addHref} title={addTitle} />}
    </MuiStack>
  );
};
