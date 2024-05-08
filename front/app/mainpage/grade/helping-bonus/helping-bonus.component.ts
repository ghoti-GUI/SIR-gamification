import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { User } from "../../../models/user.model";
import { debounceTime, Observable, of, startWith } from "rxjs";
import { GradeService } from "../../../services/grade.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { StudentGrade } from "../../../models/grade.model";
import { Router } from "@angular/router";
import { MatInputModule } from "@angular/material/input";

@Component({
    selector: "app-helping-bonus",
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, MatAutocompleteModule, MatTooltipModule, MatInputModule],
    templateUrl: "./helping-bonus.component.html",
    styleUrl: "./helping-bonus.component.css",
})
export class HelpingBonusComponent implements OnInit {
    // Liste pour l'autocomplétion lors de la recherche
    studentListAutocompletion!: Observable<User[]>;
    // Liste des users filtrés lors de la recherche
    usersList: User[] = [];
    chosenStudent!: User | undefined;
    // Deuxième liste pour l'autocomplétion lors de la recherche
    student2ListAutocompletion!: Observable<User[]>;
    // Deuxième liste des users filtrés lors de la recherche
    usersList2: User[] = [];
    // Deuxième objet user envoyé lors de la suoumission
    chosenStudent2!: User | undefined;
    constructor(
        public dialogRef: MatDialogRef<HelpingBonusComponent>,
        private formBuilder: FormBuilder,
        private gradeService: GradeService,
        private router: Router,
        @Inject(MAT_DIALOG_DATA) public grade: StudentGrade,
    ) {}
    studentBonusForm = this.formBuilder.group({
        student1: ["", [Validators.nullValidator, (c: FormControl) => this.validateName(c, "student1")]],
        student2: ["", [Validators.nullValidator, (c: FormControl) => this.validateName(c, "student2")]],
    });
    ngOnInit(): void {
        this.initStudent();
    }
    initStudent() {
        // Requête pour obtenir les élèves pour qui l'utilisateur a voté
        this.gradeService.getBonus(this.grade.progressionId).subscribe({
            next: (students: User[]) => {
                if (students.length >= 1) {
                    this.chosenStudent = students[0];
                    this.studentBonusForm.get("student1")?.setValue(this.studentName(students[0]));
                    this.studentFilter(this.studentName(students[0]), 0);
                    if (students.length >= 2) {
                        this.chosenStudent2 = students[1];
                        this.studentBonusForm.get("student2")?.setValue(this.studentName(students[1]));
                        this.studentFilter(this.studentName(students[1]), 1);
                    }
                }
                this.initAutoCompletion();
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
    // Initialiser l'autocomplétion à chaque changement de valeur
    initAutoCompletion(): void {
        this.studentBonusForm
            .get("student1")
            ?.valueChanges.pipe(debounceTime(300), startWith(""))
            .subscribe((value) => this.studentFilter(value, 0));
        this.studentBonusForm
            .get("student2")
            ?.valueChanges.pipe(debounceTime(300), startWith(""))
            .subscribe((value) => this.studentFilter(value, 1));
    }
    // Affecter à la liste d'autocomplétion les valeurs filtrés du back
    studentFilter(value: string | null, index: number): void {
        if (value && value.length > 2) {
            const filterValue = value.toLowerCase();
            this.gradeService.getUserList(this.grade.sessionId, filterValue as string).subscribe({
                next: (users: User[]) => {
                    if (index === 0) {
                        this.usersList = users;
                        this.studentListAutocompletion = of(users);
                    } else {
                        this.usersList2 = users;
                        this.student2ListAutocompletion = of(users);
                    }
                },
                error: (err) => {
                    console.log(err);
                },
            });
        } else {
            this.studentListAutocompletion = of([]);
        }
    }
    // Retourne le nom complet de l'élève
    studentName(student: User | undefined) {
        return student === undefined ? null : student.name + " " + student.surname;
    }
    // Vérifie que l'input correspond à un élève dans la userList et qu'il n'a pas été assigné deux fois
    validateName(control: AbstractControl, s: string): ValidationErrors | null {
        const name: string = control.value;
        if (name) {
            if (s === "student1") {
                const existsName: boolean = this.usersList.some((student) => this.studentName(student) === name);
                if (!existsName) {
                    this.chosenStudent = undefined;
                    control.setErrors({ nameError: "Le nom entré n'existe pas" });
                    return { nameError: "Le nom entré n'existe pas" };
                }
                if (name === this.studentName(this.chosenStudent2)) {
                    this.chosenStudent = undefined;
                    control.setErrors({ nameUsedError: "Le nom entré est déjà utilisé pour le deuxième étudiant" });
                    return { nameUsedError: "Le nom entré est déjà utilisé pour le deuxième étudiant" };
                }
                this.chosenStudent = this.usersList.find((student) => this.studentName(student) === name)!;
            } else {
                const existsName: boolean = this.usersList2.some((student) => this.studentName(student) === name);
                if (!existsName) {
                    this.chosenStudent2 = undefined;
                    control.setErrors({ nameError: "Le nom entré n'existe pas" });
                    return { nameError: "Le nom entré n'existe pas" };
                }
                if (name === this.studentName(this.chosenStudent)) {
                    this.chosenStudent2 = undefined;
                    control.setErrors({ nameUsedError: "Le nom entré est déjà utilisé pour le premier étudiant" });
                    return { nameUsedError: "Le nom entré est déjà utilisé pour le premier étudiant" };
                }
                this.chosenStudent2 = this.usersList2.find((student) => this.studentName(student) === name)!;
            }
            return null;
        }
        return null;
    }
    // Enregistrer les modifications dans le back
    onSubmit() {
        if (this.studentBonusForm.valid) {
            const students: User[] = [];
            if (this.chosenStudent !== undefined) {
                students.push(this.chosenStudent);
            }
            if (this.chosenStudent2 !== undefined) {
                students.push(this.chosenStudent2);
            }
            this.gradeService.setBonus(students, this.grade.progressionId).subscribe({
                next: () => {
                    this.dialogRef.close();
                    alert("Vos changements ont été enregistrés.");
                },
                error: (err) => {
                    if (err.error.message === "cannot edit bonuses 1h after session ends") {
                        alert(
                            "Vos changements n'ont pas été enregistrés. Vous ne pouvez pas ajouter de bonus une heure après la fin de la session.",
                        );
                    }
                    console.log(err);
                    this.dialogRef.close();
                },
            });
        }
    }
    // Supprimer l'élève dans le premier input
    deleteStudent1() {
        this.chosenStudent = undefined;
        this.studentBonusForm.get("student1")?.setValue("");
    }
    // Supprimer l'élève dans le second input
    deleteStudent2() {
        this.chosenStudent2 = undefined;
        this.studentBonusForm.get("student2")?.setValue("");
    }
    // Annuler la saisie
    onCancel() {
        this.dialogRef.close();
    }
}
