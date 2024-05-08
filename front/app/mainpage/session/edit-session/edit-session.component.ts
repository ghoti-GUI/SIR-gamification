import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { HeaderComponent } from "../../header/header.component";
import { Header } from "../../header/header";
import { CreateSession, Session, SessionStatus, TeacherSession } from "../../../models/session.model";
import { SessionService } from "../../../services/session.service";

@Component({
    selector: "app-edit-session",
    standalone: true,
    imports: [
        CommonModule,
        HeaderComponent,
        ReactiveFormsModule,
        RouterLink,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
    ],
    templateUrl: "./edit-session.component.html",
    styleUrl: "./edit-session.component.css",
})
export class EditSessionComponent implements OnInit {
    session!: Session | TeacherSession;
    section: Header = { name: `Session/SESSION_NAME/edit_session` };
    tps!: string[];
    loading = true;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private sessionService: SessionService,
        private activeRoute: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.session = history.state.session;
        if (this.session === undefined) {
            this.activeRoute.params.subscribe((params) => {
                this.sessionService.getSession(params["id"]).subscribe({
                    next: (session) => {
                        this.session = session;
                        this.section = {
                            name: `Notes/${this.session.name}/modifier`,
                        };
                        this.withSession();
                    },
                    error: (err) => {
                        console.log(err);
                        this.router.navigate(["/session"]);
                    },
                });
            });
        } else {
            this.withSession();
        }
    }

    withSession() {
        this.sessionService.fetchTPs().subscribe({
            next: (tps) => {
                this.tps = tps;
                if (this.session.status == "inProgress") {
                    this.editSessionForm.get("TP")?.disable();
                    this.editSessionForm.get("startDate")?.disable();
                }

                this.section =
                    this.session.status === SessionStatus.INPROGRESS
                        ? { name: `Session/ "${this.session.name}" /modifier_session_en_cours` }
                        : { name: `Session/ "${this.session.name}" /modifier_session_programmée` };

                this.editSessionForm.get("name")?.setValue(this.session.name);
                const startDate = new Date(this.session.startDate);
                startDate.setHours(startDate.getHours() - startDate.getTimezoneOffset() / 60);
                const endDate = new Date(this.session.endDate);
                endDate.setHours(endDate.getHours() - endDate.getTimezoneOffset() / 60);
                this.editSessionForm.get("startDate")?.setValue(startDate.toISOString().substring(0, 16));
                this.editSessionForm.get("endDate")?.setValue(endDate.toISOString().substring(0, 16));
                this.editSessionForm.get("TP")?.setValue(this.session.TP);
                this.loading = false;
            },
            error: (err) => {
                console.log(err);
                this.router.navigate(["/session"]);
            },
        });
    }

    editSessionForm = this.formBuilder.group(
        {
            name: ["", Validators.required],
            password: [""],
            TP: ["", Validators.required],
            startDate: ["", Validators.required],
            endDate: ["", Validators.required],
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

    passwordVisible = false;
    public viewPassword(): void {
        this.passwordVisible = !this.passwordVisible;
    }

    onSubmit() {
        const startDate = new Date(this.editSessionForm.value.startDate as string);
        const endDate = new Date(this.editSessionForm.value.endDate as string);
        const editedSession: CreateSession = {
            name: this.editSessionForm.value.name as string,
            password: this.editSessionForm.value.password as string,
            TP: this.session.status == "scheduled" ? (this.editSessionForm.value.TP as string) : this.session.TP,
            startDate: this.session.status == "scheduled" ? startDate : this.session.startDate,
            endDate: endDate,
        };

        this.sessionService.editSession(this.session.id, editedSession).subscribe({
            next: () => {
                this.router.navigate(["/session"]);
            },
            error: (err) => {
                console.log(err);
                this.router.navigate(["/session"]);
            },
        });
    }
}
