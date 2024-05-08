import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Header } from "../../header/header";
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { debounceTime, Observable, of } from "rxjs";
import { HeaderComponent } from "../../header/header.component";
import { Router } from "@angular/router";
import { TeacherUser } from "../../../models/user.model";
import { startWith } from "rxjs/operators";
import { AdminService } from "../../../services/admin.service";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { SessionService } from "../../../services/session.service";

@Component({
    selector: "app-add-teacher",
    standalone: true,
    imports: [
        CommonModule,
        HeaderComponent,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatOptionModule,
    ],
    templateUrl: "./add-teacher.component.html",
    styleUrl: "./add-teacher.component.css",
})
export class AddTeacherComponent implements OnInit {
    usersList: TeacherUser[] = [];
    tps!: string[];
    teacher!: TeacherUser;
    section: Header = {
        name: "Admin/ajouter_encadrant",
    };
    chosenTeacher!: TeacherUser;
    teacherListAutocompletion!: Observable<TeacherUser[]> | undefined;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private adminService: AdminService,
        private sessionService: SessionService,
    ) {}

    ngOnInit(): void {
        this.sessionService.fetchTPs().subscribe({
            next: (tps: string[]) => {
                this.tps = tps;
            },
            error: (err) => {
                this.router.navigate(["/home"]);
                console.log(err);
            },
        });
        this.initAutoCompletion();
    }

    initAutoCompletion(): void {
        if (this.teacher !== undefined) {
            this.chosenTeacher = this.teacher;
            this.addTeacherForm.get("teacher")?.setValue(this.teacherName(this.teacher));
        }
        this.addTeacherForm
            .get("teacher")
            ?.valueChanges.pipe(debounceTime(300), startWith(""))
            .subscribe((value) => this.teacherFilter(value));
    }

    protected teacherName(teacher: TeacherUser) {
        return teacher.name + " " + teacher.surname;
    }

    teacherFilter(value: string | null): void {
        if (value && value.length > 2) {
            const filterValue = value.toLowerCase();
            this.adminService.getUserList(filterValue as string).subscribe({
                next: (users: TeacherUser[]) => {
                    this.usersList = users;
                    const teacherUsers = this.usersList.filter((user) =>
                        this.teacherName(user).toLowerCase().includes(filterValue),
                    );
                    this.teacherListAutocompletion = of(teacherUsers);
                },
                error: (err) => {
                    console.log(err);
                },
            });
        } else {
            this.teacherListAutocompletion = of([]);
        }
    }

    addTeacherForm = this.formBuilder.group({
        teacher: ["", [Validators.required, this.validateName.bind(this)]],
        TP: [[""], Validators.required],
    });

    validateName(control: AbstractControl): ValidationErrors | null {
        const name: string = control.value;
        if (name) {
            const existsName: boolean = this.usersList.some((teacher) => this.teacherName(teacher) === name);
            if (!existsName) {
                control.setErrors({ nameError: "Le nom entré n'existe pas" });
                return { nameError: "Le nom entré n'existe pas" };
            }
            this.chosenTeacher = this.usersList.find((teacher) => this.teacherName(teacher) === name)!;
            this.addTeacherForm.get("TP")?.setValue(this.chosenTeacher.tps);
            return null;
        }
        return null;
    }

    onSubmit() {
        if (this.addTeacherForm.valid) {
            const teacher: TeacherUser = this.chosenTeacher;
            const tpsValue = this.addTeacherForm.get("TP")?.value;
            const tps: string[] = tpsValue === null || tpsValue === undefined ? [] : tpsValue;
            this.adminService.addTeacher(teacher, tps).subscribe({
                next: () => {
                    this.router.navigate(["/admin"]);
                },
                error: (err) => {
                    console.log(err);
                },
            });
        }
    }

    onCancel() {
        this.router.navigate(["/admin"]);
    }
}
