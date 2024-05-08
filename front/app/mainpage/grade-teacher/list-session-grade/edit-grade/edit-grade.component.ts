import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { HeaderComponent } from "../../../header/header.component";
import { Header } from "../../../header/header";
import { Session, TeacherSession } from "../../../../models/session.model";
import { SessionService } from "../../../../services/session.service";
import { TeacherGrade } from "../../../../models/grade.model";
import { GradeService, OverrideGrade } from "../../../../services/grade.service";

@Component({
    selector: "app-edit-grade",
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
    templateUrl: "./edit-grade.component.html",
    styleUrl: "./edit-grade.component.css",
})
export class EditGradeComponent implements OnInit {
    session!: Session | TeacherSession;
    section: Header = { name: `Notes/SESSION_NAME/modifier` };
    loading = true;

    studentListAutocompletion!: Observable<TeacherGrade[]> | undefined;
    gradeOfSelectedLevel!: number | undefined;

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
                            name: `Notes/${this.session.name}/modifier`,
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
            name: `Notes/${this.session.name}/modifier`,
        };
        // filter student
        this.initAutoCompletion();
    }

    singleGradeForm = this.formBuilder.group({
        name: ["", [Validators.required, this.validateName.bind(this)]],
        grade: ["", [Validators.required, this.validateNote()]],
        comment: [""],
    });

    levelGradeForm = this.formBuilder.group({
        level: ["", Validators.required],
        grade: ["", [Validators.required, this.validateNote()]],
    });

    // change form of students data
    listGrades!: TeacherGrade[];
    chosenStudent!: TeacherGrade | null;

    validateName(control: AbstractControl): ValidationErrors | null {
        const name: string = control.value;
        if (name) {
            const existsName: boolean = this.listGrades.some((student) => student.studentName === name);
            if (!existsName) {
                control.setErrors({ nameError: "Le nom entré n'existe pas" });
                return { nameError: "Le nom entré n'existe pas" };
            }
            this.chosenStudent = this.listGrades.find((student) => student.studentName === name)!;
            this.singleGradeForm.get("grade")?.setValue(this.chosenStudent.grade.toString());
            return null;
        }
        return null;
    }

    private initAutoCompletion() {
        this.gradeService.getGrades(this.session.id).subscribe({
            next: (grades: TeacherGrade[]) => {
                this.listGrades = grades;
                this.studentListAutocompletion = this.singleGradeForm.get("name")?.valueChanges.pipe(
                    startWith(""),
                    map((value) => this.studentFilter(value)),
                );

                this.levelGradeForm.get("level")?.valueChanges.subscribe((selectedLevel) => {
                    const levelKey = Number(selectedLevel);
                    this.gradeOfSelectedLevel = this.getGradeForLevel(levelKey);
                });
            },
            error: (err) => {
                console.log(err);
                this.router.navigate(["/"]);
            },
        });
    }

    getGradeForLevel(levelKey: number): number {
        const grade = this.session.indexGrades.get(levelKey.toString());
        return grade !== undefined ? grade : NaN;
    }

    validateNote(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const note: number = +control.value;

            if (!isNaN(note) && note >= 0 && note <= 20) {
                return null; // Note is valid
            } else {
                return { invalidNote: { value: control.value } }; // Note is invalid
            }
        };
    }

    private studentFilter(value: string | null): TeacherGrade[] {
        if (value) {
            const filterValue = value.toLowerCase();
            return this.listGrades.filter((student) => student.studentName.toLowerCase().includes(filterValue));
        }
        return this.listGrades;
    }

    onSubmitStudentGrade() {
        const gradeString = this.singleGradeForm.get("grade")?.value;
        const comment = this.singleGradeForm.get("comment")?.value || "";

        if (!this.chosenStudent || !this.singleGradeForm.valid || gradeString === undefined || gradeString === null) {
            return;
        }
        const overrideGrade: OverrideGrade = {
            grade: parseInt(gradeString),
            comment: comment,
        };
        this.gradeService.setGradeOverride(this.chosenStudent.progressionId, overrideGrade).subscribe({
            next: () => {
                this.gotoListGrade();
            },
            error: (err) => {
                console.log(err);
                alert("Impossible de modifier la note");
            },
        });
    }

    resetGrade() {
        if (!this.chosenStudent) {
            return;
        }
        this.gradeService.removeGradeOverride(this.chosenStudent.progressionId).subscribe({
            next: () => {
                this.gotoListGrade();
            },
            error: (err) => {
                console.log(err);
                alert("Impossible de réinitialiser la note");
            },
        });
    }

    onSubmitLevelGrade() {
        const gradeString = this.levelGradeForm.get("grade")?.value;
        const levelString = this.levelGradeForm.get("level")?.value;
        if (
            !this.levelGradeForm.valid ||
            gradeString === undefined ||
            gradeString === null ||
            levelString === undefined ||
            levelString === null
        ) {
            return;
        }
        this.gradeService
            .setLevelGradeOverride(this.session.id, {
                level: parseInt(levelString),
                grade: parseInt(gradeString),
            })
            .subscribe({
                next: (nonModified) => {
                    alert(
                        "Les notes des élèves suivants n'ont pas été modifiées: \n" +
                            nonModified.map((g) => g.studentName).reduce((a, b) => a + "\n " + b),
                    );
                    this.gotoListGrade();
                },
                error: (err) => {
                    console.log(err);
                    alert("Impossible de modifier la note");
                },
            });
    }

    resetLevelGrade() {
        this.gradeService.removeLevelGradeOverride(this.session.id).subscribe({
            next: (nonModified) => {
                alert(
                    "Les notes des élèves suivants n'ont pas été modifiées: \n" +
                        nonModified.map((g) => g.studentName).reduce((a, b) => a + "\n " + b),
                );
                this.gotoListGrade();
            },
            error: (err) => {
                console.log(err);
                alert("Impossible de réinitialiser la note");
            },
        });
    }
    gotoListGrade() {
        this.router.navigateByUrl(`/grade-teacher/${this.session.id}/lookup`, { state: this.session });
    }
}
