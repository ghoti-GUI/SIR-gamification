import { Component, OnInit } from "@angular/core";
import { HeaderComponent } from "../../header/header.component";
import { Header } from "../../header/header";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { Observable } from "rxjs";
import { CommonModule } from "@angular/common";
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { TeacherUser } from "../../../models/user.model";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatOptionModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { map, startWith } from "rxjs/operators";
import { AdminService } from "../../../services/admin.service";
import { SessionService } from "../../../services/session.service";

@Component({
    selector: "app-modify-access",
    standalone: true,
    imports: [
        HeaderComponent,
        RouterLink,
        RouterLinkActive,
        CommonModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatOptionModule,
        MatInputModule,
    ],
    templateUrl: "./modify-access.component.html",
    styleUrl: "./modify-access.component.css",
})
export class ModifyAccessComponent implements OnInit {
    usersList: TeacherUser[] = [];
    tps!: string[];
    teacher!: TeacherUser;
    section: Header = {
        name: "Admin/modifier_accès_encadrant",
    };
    teacherList!: TeacherUser[];
    teacherListAutocompletion!: Observable<TeacherUser[]> | undefined;
    chosenTeacher!: TeacherUser;
    loading = true;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private adminService: AdminService,
        private sessionService: SessionService,
    ) {}

    ngOnInit(): void {
        this.teacher = history.state;
        this.adminService.getTeachers().subscribe({
            next: (teachers: TeacherUser[]) => {
                this.teacherList = teachers;
                this.sessionService.fetchTPs().subscribe({
                    next: (tps: string[]) => {
                        this.tps = tps;
                        this.initAutoCompletion();
                        this.loading = false;
                    },
                    error: (err) => {
                        console.log(err);
                    },
                });
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    initAutoCompletion(): void {
        if (this.teacher !== undefined) {
            this.chosenTeacher = this.teacher;
            this.modifyAccessForm.get("teacher")?.setValue(this.teacherName(this.teacher));
        }
        this.teacherListAutocompletion = this.modifyAccessForm.get("teacher")?.valueChanges.pipe(
            startWith(""),
            map((value) => this.teacherFilter(value)),
        );
    }

    private teacherFilter(value: string | null): TeacherUser[] {
        if (value) {
            const filterValue = value.toLowerCase();
            return this.teacherList.filter((teacher) => this.teacherName(teacher).toLowerCase().includes(filterValue));
        }
        return this.teacherList;
    }

    protected teacherName(teacher: TeacherUser) {
        return teacher.name + " " + teacher.surname;
    }

    modifyAccessForm = this.formBuilder.group({
        teacher: ["", [Validators.required, this.validateName.bind(this)]],
        TP: [[""], [Validators.nullValidator]],
    });

    validateName(control: AbstractControl): ValidationErrors | null {
        const name: string = control.value;
        if (name) {
            const existsName: boolean = this.teacherList.some((teacher) => this.teacherName(teacher) === name);
            if (!existsName) {
                control.setErrors({ nameError: "Le nom entré n'existe pas" });
                return { nameError: "Le nom entré n'existe pas" };
            }
            this.chosenTeacher = this.teacherList.find((teacher) => this.teacherName(teacher) === name)!;
            this.modifyAccessForm.get("TP")?.setValue(this.chosenTeacher.tps);
            return null;
        }
        return null;
    }

    onSubmit() {
        if (this.modifyAccessForm.invalid) {
            return;
        }
        if (this.chosenTeacher === undefined) {
            return;
        }
        const value = this.modifyAccessForm.get("TP")?.value;
        if (value === null || value === undefined) {
            return;
        }
        this.adminService.modifyTeacherAccess(this.chosenTeacher.id, value).subscribe({
            next: () => {
                this.router.navigate(["/admin/"]);
            },
            error: (err) => {
                console.log(err);
                this.router.navigate(["/admin/"]);
            },
        });
    }

    onCancel() {
        this.router.navigate(["/admin"]);
    }
}
