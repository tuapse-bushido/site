import {
  FieldsetHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';

/**
 * Props for a standard <div> element.
 *
 * Based on React's `HTMLAttributes<HTMLDivElement>`.
 *
 * ---
 * Пропсы для стандартного HTML-элемента `<div>`,
 * основанные на типе `HTMLAttributes<HTMLDivElement>` из React.
 */
export type DivProps = HTMLAttributes<HTMLDivElement>;

export type FieldsetProps = FieldsetHTMLAttributes<HTMLFieldSetElement>;
export type InputProps = InputHTMLAttributes<HTMLInputElement>;
export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export type TableProps = TableHTMLAttributes<HTMLTableElement>;
export type THeadProps = HTMLAttributes<HTMLTableSectionElement>;
export type TBodyProps = HTMLAttributes<HTMLTableSectionElement>;
export type TFootProps = HTMLAttributes<HTMLTableSectionElement>;
export type TRowProps = HTMLAttributes<HTMLTableRowElement>;
export type TCellProps = TdHTMLAttributes<HTMLTableCellElement>;
export type TCellHeadProps = ThHTMLAttributes<HTMLTableCellElement>;
