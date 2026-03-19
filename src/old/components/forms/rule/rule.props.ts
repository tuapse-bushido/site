import { AddonRuleFull, Category, Product } from '@/types';
import { FormState } from '@/types/actions/form-schemas';

export type RuleFormProps = {
  products: Product[];
  categories: Category[];
  rule?: AddonRuleFull;
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
};
