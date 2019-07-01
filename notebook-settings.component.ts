import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { CustomModalComponent } from '../custom-modal/custom-modal.component';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { PetitionService,UserService } from '../_services';
import { Router, ActivatedRoute } from '@angular/router';
import { NoteBook } from '../_models/notebook';
import { first } from 'rxjs/operators';
import { WorkDistributionSettingsComponent } from '../notebook-settings/work-distribution-settings/work-distribution-settings.component';
import { WorkBookClass } from '../_models/workbookClass';
import { AlertService, AlertType } from 'src/app/_services';

@Component({
    selector: 'app-notebook-settings',
    templateUrl: './notebook-settings.component.html',
    styleUrls: ['./notebook-settings.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class NotebookSettingsComponent implements OnInit {
    notebookForm: FormGroup;
    users: any;
    customRadioInline1: number = 2;

    constructor(private alertService: AlertService, 
                private route: ActivatedRoute, private router: Router, 
                private petitionService: PetitionService, 
                private userService: UserService) { }


    @ViewChild(WorkDistributionSettingsComponent, { static: false })
    private workDistributionSettingsComponent: WorkDistributionSettingsComponent;

    /*
        Custom Modal
    */
    @ViewChild('componentInsideModal', { static: false }) componentInsideModal: CustomModalComponent;

    openFromComponent() {
        this.componentInsideModal.open();
    }

    close() {
        this.componentInsideModal.close();
        this.router.navigate(['/notebook-list']);
    }
    /* End Custom Modal */
    backtoList() {
        this.router.navigate(['/notebook-list']);
    }
    ngOnInit() {
        this.notebookForm = new FormGroup({
            'notebookName': new FormControl('', Validators.required),
            'notebookHaveComplainers': new FormControl(''),
            'notebookHaveComplainersTo': new FormControl(''),
            'notebookHaveIssues': new FormControl(''),
        });
        let workbookId: number;
        workbookId = Number.parseInt(this.route.snapshot.paramMap.get("id"));
        if (workbookId > 0) {
            this.getWorkBookData(workbookId)
        }
    }

    getWorkBookData(workbookId) {
        this.petitionService.getWorkDistributionByworkbookId(workbookId).subscribe(
            data => {
                if (data.length > 0) {
                    this.notebookForm.controls['notebookName'].setValue(data[0].workBook.name);
                    this.notebookForm.controls['notebookHaveComplainers'].setValue(data[0].workBook.haveComplainers);
                    this.notebookForm.controls['notebookHaveComplainersTo'].setValue(data[0].workBook.haveComplainersTo);
                    this.notebookForm.controls['notebookHaveIssues'].setValue(data[0].workBook.haveIssues);
                    this.customRadioInline1 = data[0].workBook.petitionType.id;
                    this.assignMembers(data)
                }
            },
            error => {
                this.alertService.alert({
                    Type: AlertType.ERROR,
                    Message: 'ERROR_HAPPEN'
                });
            });
    }
    assignMembers(data) {
        let userIds = [];
        let members = [];
        for (var i = 0; i < data.length; i++) {
            var index = -1;
            for (var j = 0; j < userIds.length; j++) {
                if (data[i].userId == userIds[j]) {
                    index = j;
                    break;
                }
            }
            
            if (index == -1) {
                let member = { member: {}, zero: false, one: false, two: false, three: false, four: false, five: false, six: false, seven: false, eight: false, nine: false };
                members.push(member);
                userIds.push(data[i].userId);
                index = members.length - 1;
            }
            this.workDistributionSettingsComponent.numbers[data[i].assignedPetitionId] = true;
            if (data[i].assignedPetitionId == 0) {
                members[index].zero = true;
            } else if (data[i].assignedPetitionId == 1) {
                members[index].one = true;
            } else if (data[i].assignedPetitionId == 2) {
                members[index].two = true;
            } else if (data[i].assignedPetitionId == 3) {
                members[index].three = true;
            } else if (data[i].assignedPetitionId == 4) {
                members[index].four = true;
            } else if (data[i].assignedPetitionId == 5) {
                members[index].five = true;
            } else if (data[i].assignedPetitionId == 6) {
                members[index].six = true;
            } else if (data[i].assignedPetitionId == 7) {
                members[index].seven = true;
            } else if (data[i].assignedPetitionId == 8) {
                members[index].eight = true;
            } else if (data[i].assignedPetitionId == 9) {
                members[index].nine = true;
            }
        }

        

        this.userService.getbyDepartmentIdAndPrivilegeName(373, "can_receive_petition").pipe(first()).subscribe(
            data => {
                this.users = data
                for (var i = 0; i < members.length; i++) {
                    for (var j = 0; j < this.users.length; j++) {
                        if (this.users[j].id == userIds[i])
                            members[i].member = this.users[j];
                    }
                    if(i+1>=members.length){
                        this.workDistributionSettingsComponent.members = members;
                    }
                }
            },
            error => {
                this.alertService.alert({
                    Type: AlertType.ERROR,
                    Message: 'ERROR_HAPPEN'
                });
            }
        );


       
        
    }

    onSubmit() {
        if (this.notebookName.value === "") {
            this.alertService.alert({
                Type: AlertType.ERROR,
                Message: 'REPORT_NAME_MANDATORY'
            });
            return;
        }
        if (this.notebookForm.invalid) {
            return;
        }
        let noteBook: NoteBook = new NoteBook();
        noteBook.name = this.notebookName.value;
        noteBook.haveComplainers = this.notebookHaveComplainers.value === true ? true : false;
        noteBook.haveComplainersTo = this.notebookHaveComplainersTo.value === true ? true : false;
        noteBook.haveIssues = this.notebookHaveIssues.value === true ? true : false;
        noteBook.type = this.customRadioInline1;
        let workBookClass: WorkBookClass = new WorkBookClass();
        workBookClass.workDistributionWrapper = this.workDistributionSettingsComponent.save();
        if (workBookClass.workDistributionWrapper == null) {
            return;
        }
        workBookClass.workbookDto = noteBook;
        let workbookId: number;
        workbookId = Number.parseInt(this.route.snapshot.paramMap.get("id"));
        if (workbookId > 0) {
            this.petitionService.updatewithDistribution(workBookClass, workbookId).pipe(first()).subscribe(
                data => {
                    this.openFromComponent();
                },
                error => {
                    this.alertService.alert({
                        Type: AlertType.ERROR,
                        Message: 'ERROR_WHILE_EDIT'
                    });
                });
        } else {
            this.petitionService.addwithDistribution(workBookClass).pipe(first()).subscribe(
                data => {
                    this.openFromComponent();
                },
                error => {
                    if (error.status === 409) {
                        this.alertService.alert({
                            Type: AlertType.ERROR,
                            Message: 'REPORT_ALREADY_EXIST'
                        });
                    }
                });
        }
    }
    get notebookName() { return this.notebookForm.get('notebookName'); }
    get notebookHaveComplainers() { return this.notebookForm.get('notebookHaveComplainers'); }
    get notebookHaveComplainersTo() { return this.notebookForm.get('notebookHaveComplainersTo'); }
    get notebookHaveIssues() { return this.notebookForm.get('notebookHaveIssues'); }
}
