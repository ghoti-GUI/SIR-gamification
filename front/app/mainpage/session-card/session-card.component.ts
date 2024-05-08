import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { JoinComponent } from "../session/join/join.component";
import { Header } from "../header/header";
import { Session, SessionStatus, TeacherSession } from "../../models/session.model";
import { Router, RouterLink } from "@angular/router";
import { PrivateUser, UserType } from "../../models/user.model";
import { UserService } from "../../services/user.service";
import { SessionService } from "../../services/session.service";

@Component({
    selector: "app-session-card",
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: "./session-card.component.html",
    styleUrl: "./session-card.component.css",
})
export class SessionCardComponent implements OnInit {
    openDialog(session: Session): void {
        const dialogRef = this.dialog.open(JoinComponent, {
            // width: "60%",
            height: "40%",
            data: session,
        });

        dialogRef.afterClosed().subscribe((password) => {
            if (password) {
                this.rejoinSession(session, password);
            }
        });
    }

    constructor(
        public dialog: MatDialog,
        private userService: UserService,
        private sessionService: SessionService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.userService.getCurrentUser().subscribe((user: PrivateUser) => {
            this.user = user;
        });
        if (this.Header.name == "Accueil") {
            this.sessionService.getAvailableSessions().subscribe((sessions: Session[] | TeacherSession[]) => {
                this.sessions = sessions;
            });
        } else if (this.Header.name == "Sessions" || this.Header.name == "Notes") {
            this.sessionService.getAllSessions().subscribe((sessions: Session[] | TeacherSession[]) => {
                this.sessions = sessions;
            });
        }
    }

    deleteSession(session: Session | TeacherSession) {
        if (confirm("Etes-vous sûr de supprimer cette session?")) {
            this.sessionService.deleteSession(session).subscribe({
                next: () => {
                    this.sessions = this.sessions.filter((s: Session | TeacherSession) => s.id != session.id);
                },
                error: () => {
                    alert("Impossible de supprimer la session, veuillez réessayer plus tard.");
                },
            });
        }
    }

    endSession(session: Session | TeacherSession) {
        if (confirm("Etes-vous sûr de fermer la session?")) {
            this.sessionService.endSession(session).subscribe({
                next: (session) => {
                    this.sessions = this.sessions.filter((s: Session | TeacherSession) => s.id != session.id);
                    this.sessions.push(session);
                },
                error: (err) => {
                    alert("Impossible de terminer la session.\n" + "Erreur: " + err.error.message);
                },
            });
        }
    }

    rejoinSession(session: Session, password = "") {
        this.sessionService.joinSession(session, password).subscribe({
            next: (data) => {
                console.log(data);
                alert("Vous avez rejoint la session: " + data.session.name);
                const urlTree = this.router.createUrlTree([`/tp/${data.session.id}`], {
                    queryParams: {
                        token: data.token,
                        level: data.progression.level,
                    },
                });
                const url = this.router.serializeUrl(urlTree);
                window.open(url, "_blank");
            },
            error: (err) => {
                alert("Impossible de rejoindre la session.\n" + "Erreur: " + err.error.message);
            },
        });
    }

    calculateFontSize(textLength: number): string {
        const baseSize = 28;
        const minSize = 10;
        const scalingFactor = 0.5;

        const calculatedSize = baseSize - textLength * scalingFactor;

        return Math.max(calculatedSize, minSize) + "px";
    }

    gotoClickedListGrade(session: Session | TeacherSession) {
        this.router.navigateByUrl(`/grade-teacher/${session.id}/lookup`, { state: { session } });
    }

    sessions: Session[] | TeacherSession[] = [];
    @Input() Header!: Header;
    user!: PrivateUser;

    protected readonly SessionStatus = SessionStatus;
    protected readonly UserType = UserType;

    gotoProgression(session: Session | TeacherSession) {
        this.router.navigateByUrl(`/session/${session.id}/progressions`, { state: session });
    }
    gotoEditSession(session: Session | TeacherSession) {
        this.router.navigateByUrl(`/session/${session.id}/editSession`, { state: session });
    }
}
