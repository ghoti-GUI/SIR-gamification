import { TestBed } from "@angular/core/testing";

import { UserService } from "./user.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClient } from "@angular/common/http";

describe("UserService", () => {
    let service: UserService;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [UserService],
        });
        service = TestBed.inject(UserService);
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should be OK returning no heroes", () => {
        service.getBatch([]).subscribe({
            next: (users) => expect(users.length).toEqual(0, "should have empty heroes array"),
            error: fail,
        });
        const req = httpTestingController.expectOne(service.root + "batch");
        req.flush([]); // Respond with no heroes
    });
});
