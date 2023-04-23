import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { customValidator } from './utils/custom.validator';
import { WindowRef } from './services/window-object.service';
import { fromEvent, map, tap } from 'rxjs';
// @UntilDestroy()
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  form: any;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private winRef: WindowRef) {}
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fullname: ['', Validators.required],
      username: ['', Validators.required],
      nestedFormGroup: this.formBuilder.group(
        {
          field1: [''],
          field2: [''],
        }
        // {
        //   validators: [customValidator()],
        //   updateOn: 'blur',
        // }
      ),
    });
    this.handleDomTargetClicked();
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  get nestedFormGroupControls(): { [key: string]: AbstractControl } {
    return this.form.controls.nestedFormGroup.controls;
  }

  get nestedFormGroup() {
    return this.form.controls.nestedFormGroup as FormGroup;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    console.log(JSON.stringify(this.form.value, null, 2));
  }

  isNestedFormGroupElementClicked = false;
  isNestedFormGroupElementFocusoutTriggered = false;
  windowClick$ = fromEvent(this.winRef.nativeWindow, 'click');
  handleDomTargetClicked() {
    this.windowClick$
      .pipe(
        // untilDestroyed(this),
        map((event) => {
          return event.target;
        })
      )
      .subscribe(() => {
        if (
          this.isNestedFormGroupElementFocusoutTriggered &&
          !this.isNestedFormGroupElementClicked
        ) {
          {
            this.customValidatorInComponent();
            this.isNestedFormGroupElementFocusoutTriggered = false;
          }
        }
      });
  }
  onNestedFormFocusout() {
    this.isNestedFormGroupElementFocusoutTriggered = true;
  }
  customValidatorInComponent() {
    let fieldValues = [
      this.nestedFormGroup.value.field1,
      this.nestedFormGroup.value.field2,
    ];

    let isAllValuesEmpty = fieldValues.every((value) => {
      return value.length === 0;
    });

    let isAtLeastOneValueEmpty = fieldValues.some((value) => {
      return value.length === 0;
    });

    if (isAllValuesEmpty || !isAtLeastOneValueEmpty) {
      this.nestedFormGroup.setErrors(null);
      return;
    }

    let error = { customValidationError: true };
    this.nestedFormGroup.setErrors(error);
  }
}
