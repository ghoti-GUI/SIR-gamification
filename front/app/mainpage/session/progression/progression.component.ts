import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { HeaderComponent } from "../../header/header.component";
import { Header } from "../../header/header";
import { SessionService } from "../../../services/session.service";
import { Session, TeacherSession } from "../../../models/session.model";
import { TeacherGrade } from "../../../models/grade.model";
import { GradeService } from "../../../services/grade.service";

@Component({
    selector: "app-progression",
    standalone: true,
    imports: [HeaderComponent, CommonModule, FormsModule, RouterLink],
    templateUrl: "./progression.component.html",
    styleUrl: "./progression.component.css",
})
export class ProgressionComponent implements OnInit {
    session!: Session | TeacherSession;
    section: Header = { name: `Session//avancement` };
    loading: boolean = true;
    listProgression!: TeacherGrade[];
    filteredProgressions: TeacherGrade[] = this.listProgression;
    studentNameSearch = "";
    maxLevel: number = 0;

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
                        this.session = session;
                        this.section = {
                            name: `Session/${this.session.name}/avancement`,
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
            name: `Session/${this.session.name}/avancement`,
        };
        this.withSession();
    }

    withSession() {
        this.maxLevel = this.session.indexGrades.size - 1;
        this.gradeService.getGrades(this.session.id).subscribe({
            next: (grades) => {
                this.listProgression = grades;
                this.filteredProgressions = this.listProgression;
                this.loading = false;
            },
            error: (err) => {
                console.log(err);
                this.router.navigate(["/"]);
            },
        });
    }

    searchStudent() {
        this.filteredProgressions = this.listProgression.filter((progression) =>
            progression.studentName.toLowerCase().includes(this.studentNameSearch.toLowerCase()),
        );
    }

    getPercentage(level: number): string {
        if (0 <= level && level <= this.maxLevel) {
            return `Niveau ${level} (${(level / this.maxLevel) * 100}%)`;
        } else {
            return `Il n'y a pas de niveau: ${level}`;
        }
    }

    gotoProgressEdit() {
        this.router.navigateByUrl(`/session/${this.session.id}/progressions/edit`, { state: this.session });
    }
}
