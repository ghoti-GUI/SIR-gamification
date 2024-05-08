import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { HeaderComponent } from "../mainpage/header/header.component";
import { NgForOf, NgIf } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { LoadingService } from "../services/loading.service";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [ReactiveFormsModule, HeaderComponent, NgForOf, NgIf, ReactiveFormsModule, RouterLink],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.css",
})
export class LoginComponent implements OnInit {
    constructor(
        private userService: UserService,
        private formBuilder: FormBuilder,
        private router: Router,
        private loadingService: LoadingService,
    ) {}

    ngOnInit() {
        this.loadingService.setLoading(false);
    }

    loginForm = this.formBuilder.group({
        username: ["", Validators.required],
        password: ["", Validators.required],
    });

    onSubmit() {
        this.userService
            .login(this.loginForm.value.username as string, this.loginForm.value.password as string)
            .subscribe({
                next: () => {
                    this.router.navigateByUrl("/home");
                },
                error: (err) => {
                    console.log(err);
                    if (err.status === 401) {
                        this.loginForm.get("password")?.setErrors({
                            loginError: "Nom d'utilisateur ou mot de passe incorrect",
                        });
                        this.loginForm.get("username")?.setErrors({
                            loginError: "Nom d'utilisateur ou mot de passe incorrect",
                        });
                    }
                },
            });
    }
}
