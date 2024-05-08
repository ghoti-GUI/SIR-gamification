import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { HeaderComponent } from "../../../header/header.component";
import { Header } from "../../../header/header";
import { Session, TeacherSession } from "../../../../models/session.model";
import { SessionService } from "../../../../services/session.service";
import { GradeService } from "../../../../services/grade.service";
import { TeacherGrade } from "../../../../models/grade.model";

@Component({
    selector: "app-edit-progression",
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
    templateUrl: "./edit-progression.component.html",
    styleUrl: "./edit-progression.component.css",
})
export class EditProgressionComponent implements OnInit {
    session!: Session | TeacherSession;
    section: Header = { name: `Session/SESSION_NAME/avancement/modifier` };

    studentListAutocompletion!: Observable<TeacherGrade[]> | undefined;
    loading = true;
    listProgressions!: TeacherGrade[];
    progressionStudentChosen!: TeacherGrade;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private sessionService: SessionService,
        private gradeService: GradeService,
    ) {}

    ngOnInit(): void {
        this.session = history.state.session;
        if (this.session === undefined) {
            this.activeRoute.params.subscribe((params) => {
                this.sessionService.getSession(params["id"]).subscribe({
                    next: (session) => {
                        this.session = session;
                        this.section = {
                            name: `Session/${this.session.name}/avancement/modifier`,
                        };
                        this.loading = false;
                        // filter student
                        this.initAutoCompletion();
                    },
                    error: (err) => {
                        console.log(err);
                        this.router.navigate(["/"]);
                    },
                });
            });
            return;
        }
        this.loading = false;
        this.section = {
            name: `Session/${this.session.name}/avancement/modifier`,
        };
        // filter student
        this.initAutoCompletion();
    }

    initAutoCompletion() {
        this.gradeService.getGrades(this.session.id).subscribe({
            next: (grades: TeacherGrade[]) => {
                this.listProgressions = grades;
                this.studentListAutocompletion = this.progressionForm.get("name")?.valueChanges.pipe(
                    startWith(""),
                    map((value) => this.studentFilter(value)),
                );

                // this.progressionForm.get("progression")?.valueChanges.subscribe((progressionValue) => {
                //     this.compareProgression(progressionValue);
                // });
            },
            error: (err) => {
                console.log(err);
                this.router.navigate(["/"]);
            },
        });
        // filter student
        this.studentListAutocompletion = this.progressionForm.get("name")?.valueChanges.pipe(
            startWith(""),
            map((value) => this.studentFilter(value)),
        );
    }

    progressionForm = this.formBuilder.group({
        name: ["", [Validators.required, this.validateName.bind(this)]],
        progression: ["", Validators.required],
    });

    validateName(control: AbstractControl): ValidationErrors | null {
        const name: string = control.value;
        if (name) {
            const existsName: boolean = this.listProgressions.some((student) => student.studentName === name);
            if (!existsName) {
                control.setErrors({ nameError: "Le nom entré n'existe pas" });
                return { nameError: "Le nom entré n'existe pas" };
            }
            this.progressionStudentChosen = this.listProgressions.find((student) => student.studentName === name)!;
            this.progressionForm.get("progression")?.setValue(this.progressionStudentChosen.level.toString());
            return null;
        }
        return null;
    }

    checkProgression(): boolean {
        const value = this.progressionForm.get("progression")?.value;
        if (value === null || value === undefined) {
            return false;
        }
        const level = parseInt(value);
        return !isNaN(level) && level < this.progressionStudentChosen.level;
    }

    private studentFilter(value: string | null): TeacherGrade[] {
        if (value) {
            const filterValue = value.toLowerCase();
            return this.listProgressions.filter((student) => student.studentName.toLowerCase().includes(filterValue));
        }
        return this.listProgressions;
    }

    onSubmit() {
        const progressionString = this.progressionForm.get("progression")?.value;
        if (
            !this.progressionStudentChosen ||
            !this.progressionForm.valid ||
            progressionString === undefined ||
            progressionString === null
        ) {
            return;
        }
        const progressionInt = parseInt(progressionString);
        if (isNaN(progressionInt)) {
            return;
        }
        this.gradeService.editStudentLevel(this.progressionStudentChosen.progressionId, progressionInt).subscribe({
            next: () => {
                this.router.navigateByUrl(`/session/${this.session.id}/progressions`, { state: this.session });
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
    gotoProgression() {
        this.router.navigateByUrl(`/session/${this.session.id}/progressions`, { state: this.session });
    }

    protected readonly parseInt = parseInt;
}
