import { TestBed } from "@angular/core/testing";

import { AdminService } from "./admin.service";
import { HttpClientModule } from "@angular/common/http";

describe("AdminService", () => {
    let service: AdminService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [AdminService],
        });
        service = TestBed.inject(AdminService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
