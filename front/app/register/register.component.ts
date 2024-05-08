import { Component } from "@angular/core";
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { NgIf } from "@angular/common";
import { UserService } from "../services/user.service";
import { Router, RouterLink } from "@angular/router";

@Component({
    selector: "app-register",
    standalone: true,
    imports: [ReactiveFormsModule, NgIf, RouterLink],
    templateUrl: "./register.component.html",
    styleUrl: "./register.component.css",
})
export class RegisterComponent {
    constructor(
        private userService: UserService,
        private formBuilder: FormBuilder,
        private router: Router,
    ) {}

    registerForm = this.formBuilder.group(
        {
            username: ["", Validators.required],
            password: ["", [Validators.required, Validators.minLength(8)]],
            confirmPassword: ["", Validators.required],
            email: ["", Validators.required],
            name: ["", Validators.required],
            surname: ["", Validators.required],
        },
        { validators: this.validatePassword },
    );

    validatePassword(control: AbstractControl): ValidationErrors | null {
        // check if password contains at least one uppercase letter, a number and a special character
        const password = control.get("password")?.value as string;
        const uppercase = /[A-Z]/.test(password);
        const number = /[0-9]/.test(password);
        const special = /\W/.test(password);
        if (!uppercase || !number || !special) {
            control.get("password")?.setErrors({
                passwordError:
                    "Le mot de passe doit contenir au moins une lettre majuscule, un chiffre et un caractère spécial",
            });
            return {
                passwordError:
                    "Le mot de passe doit contenir au moins une lettre majuscule, un chiffre et un caractère spécial",
            };
        }
        if (password !== control.get("confirmPassword")?.value) {
            control.get("confirmPassword")?.setErrors({
                passwordError: "Les mots de passe ne correspondent pas",
            });
            return { passwordError: "Les mots de passe ne correspondent pas" };
        }
        return null;
    }

    onSubmit() {
        this.userService
            .register(
                this.registerForm.value.username as string,
                this.registerForm.value.password as string,
                this.registerForm.value.email as string,
                this.registerForm.value.name as string,
                this.registerForm.value.surname as string,
            )
            .subscribe({
                next: () => {
                    this.router.navigateByUrl("/home");
                },
                error: (err) => {
                    console.log(err);
                    if (err.error.error === "User already exists")
                        this.registerForm.get("username")?.setErrors({
                            loginError: "Nom d'utilisateur déjà utilisé",
                        });
                },
            });
    }

    passwordVisible = false;

    onMouseDown() {
        this.passwordVisible = true;
    }

    onMouseUp() {
        this.passwordVisible = false;
    }
}
