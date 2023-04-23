import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export function customValidator(): ValidatorFn {
  return (form: AbstractControl): Validators | null => {
    let field1Value = form.get('field1')?.value;
    let field2Value = form.get('field2')?.value;

    let fieldValues = [field1Value, field2Value];

    let isAllValuesEmpty = fieldValues.every((value) => {
      return value.length === 0;
    });

    let isAtLeastOneValueEmpty = fieldValues.some((value) => {
      return value.length === 0;
    });

    console.log('fieldValues', fieldValues);
    console.log('isAllValuesEmpty', isAllValuesEmpty);
    console.log('isAtLeastOneValueEmpty', isAtLeastOneValueEmpty);

    if (isAllValuesEmpty || !isAtLeastOneValueEmpty) {
      return null;
    }

    let error = { customValidationError: true };
    return error;
  };
}
