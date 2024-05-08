import { Component, OnInit } from "@angular/core";
import { HeaderComponent } from "../header/header.component";
import { Header } from "../header/header";
import { TeacherUser } from "../../models/user.model";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AdminService } from "../../services/admin.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@Component({
    selector: "app-admin",
    standalone: true,
    imports: [CommonModule, HeaderComponent, RouterLink, RouterLinkActive, ReactiveFormsModule, FormsModule],
    templateUrl: "./admin.component.html",
    styleUrl: "./admin.component.css",
})
export class AdminComponent implements OnInit {
    teachers: TeacherUser[] = [];
    section: Header = {
        name: "Admin",
    };
    filteredTeachers: TeacherUser[] = this.teachers;
    teacherNameSearch: string = "";
    constructor(private adminService: AdminService) {}
    ngOnInit(): void {
        this.adminService.getTeachers().subscribe({
            next: (teachers: TeacherUser[]) => {
                this.teachers = teachers;
                this.filteredTeachers = teachers;
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
    deleteTeacher(teacher: TeacherUser) {
        //Delete the teacher credentials
        if (confirm("Etes-vous sûr de supprimer l'encadrant " + teacher.name + " " + teacher.surname + "?")) {
            this.adminService.deleteTeacher(teacher.id).subscribe({
                next: () => {
                    this.teachers = this.teachers.filter((t) => t.id != teacher.id);
                },
                error: (err) => {
                    console.log(err);
                },
            });
        }
    }

    protected teacherName(teacher: TeacherUser) {
        return teacher.name + " " + teacher.surname;
    }

    searchTeacher() {
        this.filteredTeachers = this.teachers.filter((teacher) =>
            this.teacherName(teacher).toLowerCase().includes(this.teacherNameSearch.toLowerCase()),
        );
    }

    getTpsString(tps: string[]): string {
        return tps.map((value) => value.charAt(0).toUpperCase() + value.slice(1)).join(", ");
    }
}
