import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { HeaderComponent } from "../../header/header.component";
import { Header } from "../../header/header";
import { SessionService } from "../../../services/session.service";
import { TeacherSession } from "../../../models/session.model";
import { GradeService } from "../../../services/grade.service";
import { TeacherGrade } from "../../../models/grade.model";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
    selector: "app-list-session-grade",
    standalone: true,
    imports: [HeaderComponent, CommonModule, FormsModule, RouterLink, MatTooltipModule],
    templateUrl: "./list-session-grade.component.html",
    styleUrl: "./list-session-grade.component.css",
})
export class ListSessionGradeComponent implements OnInit {
    session!: TeacherSession;
    section: Header = { name: `Notes/` };
    loading: boolean = true;
    listGrade!: TeacherGrade[];
    filteredStudentGrades: TeacherGrade[] = this.listGrade;
    studentNameSearch: string = "";

    constructor(
        private sessionService: SessionService,
        private gradeService: GradeService,
        private router: Router,
        private activeRoute: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.session = history.state.session;
        if (this.session === undefined) {
            this.activeRoute.params.subscribe((params) => {
                this.sessionService.getSession(params["id"]).subscribe({
                    next: (session) => {
                        this.session = session as TeacherSession;
                        this.section = {
                            name: `Notes/${this.session.name}`,
                        };
                        this.withSession();
                    },
                    error: (err) => {
                        console.log(err);
                        this.router.navigate(["/"]);
                    },
                });
            });
            return;
        }
        this.section = {
            name: `Notes/${this.session.name}`,
        };
        this.withSession();
    }

    withSession() {
        this.gradeService.getGrades(this.session.id).subscribe({
            next: (grades) => {
                this.listGrade = grades;
                this.filteredStudentGrades = this.listGrade;
                this.loading = false;
            },
            error: (err) => {
                console.log(err);
                this.router.navigate(["/"]);
            },
        });
    }

    searchStudent() {
        this.filteredStudentGrades = this.listGrade.filter((gradeStructure) =>
            gradeStructure.studentName.toLowerCase().includes(this.studentNameSearch.toLowerCase()),
        );
    }

    gotoNoteEdit() {
        this.router.navigateByUrl(`/grade-teacher/${this.session.id}/lookup/edit`, {
            state: { session: this.session },
        });
    }
}
