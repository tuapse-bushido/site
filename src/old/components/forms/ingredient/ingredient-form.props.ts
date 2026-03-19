import { ActionFn } from '@/types/actions/form-schemas';
import { Ingredient } from '@/types/db/tables/ingredient';

export type IngredientFormProps = {
  ingredient?: Ingredient;
  action: ActionFn;
};
