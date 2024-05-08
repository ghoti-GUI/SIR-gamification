import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { calculateFontSize } from "../utils";
import { Session, TeacherSession } from "../../../models/session.model";

@Component({
    selector: "app-join",
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: "./join.component.html",
    styleUrl: "./join.component.css",
})
export class JoinComponent {
    constructor(
        public dialogRef: MatDialogRef<JoinComponent>,
        @Inject(MAT_DIALOG_DATA) public session: Session | TeacherSession,
    ) {}

    enteredPassword: string = "";
    passwordMatch: boolean | undefined;

    closeDialog(): void {
        this.dialogRef.close();
    }

    joinSession(): void {
        this.dialogRef.close(this.enteredPassword);
    }

    calculateFontSize(textLength: number): string {
        return calculateFontSize(textLength);
    }
}
