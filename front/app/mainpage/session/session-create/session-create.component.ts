import { Component, OnInit } from "@angular/core";
import { HeaderComponent } from "../../header/header.component";
import { Header } from "../../header/header";
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { NgFor, NgIf } from "@angular/common";
import { UserService } from "../../../services/user.service";
import { SessionService } from "../../../services/session.service";
import { CreateSession } from "../../../models/session.model";
import { Router } from "@angular/router";

@Component({
    selector: "app-session-create",
    standalone: true,
    imports: [HeaderComponent, ReactiveFormsModule, NgFor, NgIf],
    templateUrl: "./session-create.component.html",
    styleUrl: "./session-create.component.css",
})
export class SessionCreateComponent implements OnInit {
    section: Header = {
        name: "Session/création",
    };
    tps!: string[];

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private sessionService: SessionService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.sessionService.fetchTPs().subscribe({
            next: (tps) => {
                this.tps = tps;
            },
            error: (err) => {
                console.log(err);
            },
        });
        const startDate = new Date();
        startDate.setHours(startDate.getHours() - startDate.getTimezoneOffset() / 60);
        const endDate = new Date(startDate.getTime() + 7200000);
        this.sessionForm.get("startDate")?.setValue(startDate.toISOString().substring(0, 16));
        this.sessionForm.get("endDate")?.setValue(endDate.toISOString().substring(0, 16));
    }

    sessionForm = this.formBuilder.group(
        {
            name: ["", [Validators.required, Validators.minLength(4)]],
            password: ["", Validators.required],
            TP: ["", Validators.required],
            startDate: ["", [Validators.required]],
            endDate: ["", [Validators.required]],
        },
        { validators: this.validateDate },
    );

    validateDate(control: AbstractControl): ValidationErrors | null {
        const startDate = new Date(control.get("startDate")?.value as string);
        const endDate = new Date(control.get("endDate")?.value as string);
        if (startDate.getTime() > endDate.getTime()) {
            control.get("endDate")?.setErrors({
                dateError: "La date de fin doit être après la date de début",
            });
            return { dateError: "La date de fin doit être après la date de début" };
        }
        if (endDate.getTime() < new Date().getTime()) {
            control.get("endDate")?.setErrors({
                dateError: "La date de fin doit être après la date actuelle",
            });
            return { dateError: "La date de fin doit être après la date actuelle" };
        }
        return null;
    }

    onSubmit() {
        const startDate = new Date(this.sessionForm.value.startDate as string);
        const endDate = new Date(this.sessionForm.value.endDate as string);
        const createSession: CreateSession = {
            name: this.sessionForm.value.name as string,
            password: this.sessionForm.value.password as string,
            TP: this.sessionForm.value.TP as string,
            startDate: startDate,
            endDate: endDate,
        };
        this.sessionService.newSession(createSession).subscribe(() => {
            this.router.navigateByUrl("/session");
        });
    }
}
