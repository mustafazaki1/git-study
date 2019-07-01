import { Component, OnInit } from '@angular/core';
import { WorkDistributed } from 'src/app/_models/workDistributed';

import { AlertService, UserService, AlertType } from 'src/app/_services';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-work-distribution-settings',
    templateUrl: './work-distribution-settings.component.html',
    styleUrls: ['../notebook-settings.component.css']
})
export class WorkDistributionSettingsComponent implements OnInit {

    members: WorkDistributed[];
    member: WorkDistributed;
    set: [];
    numbers: boolean[];
    registeredUser: number[];
    users: any;
    validAddingWorker: boolean;
    constructor(private alertService: AlertService, private userService: UserService) { }

    ngOnInit() {
        this.members = []
        this.set = [];
        this.numbers = [false, false, false, false, false, false, false, false, false]
        this.users = []
        this.member = new WorkDistributed();
        this.validAddingWorker = false;
        this.getUsers();
    }


    getUsers() {
        this.userService.getbyDepartmentIdAndPrivilegeName(373, "can_receive_petition").pipe(first()).subscribe(
            data => {
                this.users = data;
            },
            error => {
                this.alertService.alert({
                    Type: AlertType.ERROR,
                    Message: 'ERROR_HAPPEN'
                });
            }
        );
    }
    getUserByUserId(userId,cb) {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id == userId)
                cb(this.users[i]);
        }
    }

    addNewmember() {

        // Missing Name 
        if (this.member.member == null) {
            this.alertService.alert({
                Type: AlertType.ERROR,
                Message: 'MEMBER_NAME_MANDATORY'
            });
        } else if (!this.validateAssigningNumberForUser(this.member)) {
            this.alertService.alert({
                Type: AlertType.ERROR,
                Message: 'ADD_AT_LEAST_MEMBER_NUMBER'
            });
        }
        else {
             let found = false;
             let size = this.members.length;
             for (let index = 0; index < size; index++) {
                const element = this.members[index];
                if (this.member.member!=null && element.member.id === this.member.member.id) {
                    found = true;
                }
                if(index+1 >= this.members.length){
                    if(found){
                        this.alertService.alert({
                            Type: AlertType.ERROR,
                            Message: "تم اضافة هذا العضو من قبل"
                        });
                    }else{
                        this.addMemberSuccessfully();
                    }
                }
            }
            if(this.members.length==0){
                this.addMemberSuccessfully();
            }

        }
    }
    addMemberSuccessfully(){
        this.validAddingWorker = false;
            this.fillNumbers(this.member);
            if (this.validAddingWorker) {
                this.members.push(this.member);
                this.member = new WorkDistributed();
                this.alertService.alert({
                    Type: AlertType.SUCCESS,
                    Message: "تم اضافه عضو بنجاح"
                });
            }
    }
    removeMemeber(index) {
        this.unassignsNumber(this.members[index]);
        this.members.splice(index, 1)
    }
    
    save() {
        let users = [];
        if (!this.checkIfDataIsEmpty(this.numbers)) {
            this.alertService.alert({
                Type: AlertType.ERROR,
                Message: 'ENTER_WORK_TYPE'
            });
            return;
        }
        if (!this.validateAssigningNumberForWorkBook(this.numbers)) {
            this.alertService.alert({
                Type: AlertType.ERROR,
                Message: 'ENTER_WORK_TYPE_IN_ORDER'
            });
            return null;
        } else {
            this.members.forEach(element => {
                let mem = this.convertToRequestObject(element);
                users.push(mem);
            });
            this.alertService.removeMessage();
            return users;
        }
    }
    checkIfDataIsEmpty(number: boolean[]) {
        if (!number[0] && !number[1] && !number[2] && !number[3] && !number[4] && !number[5] && !number[6] && !number[7] && !number[8] && !number[9]) {
            return false;
        }
        return true;
    }
    validateAssigningNumberForWorkBook(number: boolean[]) {
        if (number[0] && number[1] && number[2] && number[3] && number[4] && number[5] && number[6] && number[7] && number[8] && number[9]) {
            return true;
        }
        return false;
    }
    
    validateAssigningNumberForUser(member: WorkDistributed) {
        // TODO #REFACTOR WTH !? it must be enum with statuc value if you need 
        if (member.zero || member.one || member.two || member.three || member.four || member.five || member.six || member.seven || member.eight || member.nine) {
            return true;
        }
        return false;
    }

    fillNumbers(members: WorkDistributed) {
        // VERY BAD PRACTICE ???? NEED REFACTOR 
        if (members.zero && !this.numbers[0]) {
            this.numbers[0] = true;
        } else if (members.zero && this.numbers[0]) {
            this.alertService.alert({
                Type: AlertType.ERROR,
                Message: 'MEMBER_ALREADY_EXIST'
            });
            return;
        }
        if (members.one && !this.numbers[1]) {
            this.numbers[1] = true;
        } else if (members.one && this.numbers[1]) {
            this.alertService.alert({
                Type: AlertType.ERROR,
                Message: 'MEMBER_ALREADY_EXIST'
            });
            return;
        } if (members.two && !this.numbers[2]) {
            this.numbers[2] = true;
        } else if (members.two && this.numbers[2]) {
            this.alertService.alert({
                Type: AlertType.ERROR,
                Message: 'MEMBER_ALREADY_EXIST'
            });
            return;
        } if (members.three && !this.numbers[3]) {
            this.numbers[3] = true;
        } else if (members.three && this.numbers[3]) {
            this.alertService.alert({
                Type: AlertType.ERROR,
                Message: 'MEMBER_ALREADY_EXIST'
            });
            return;
        } if (members.four && !this.numbers[4]) {
            this.numbers[4] = true;
        } else if (members.four && this.numbers[4]) {
            this.alertService.alert({
                Type: AlertType.ERROR,
                Message: 'MEMBER_ALREADY_EXIST'
            });
            return;
        } if (members.five && !this.numbers[5]) {
            this.numbers[5] = true;
        } else if (members.five && this.numbers[5]) {
            this.alertService.alert({
                Type: AlertType.ERROR,
                Message: 'MEMBER_ALREADY_EXIST'
            });
            return;
        } if (members.six && !this.numbers[6]) {
            this.numbers[6] = true;
        } else if (members.six && this.numbers[6]) {
            this.alertService.alert({
                Type: AlertType.ERROR,
                Message: 'MEMBER_ALREADY_EXIST'
            });
            return;
        } if (members.seven && !this.numbers[7]) {
            this.numbers[7] = true;
        } else if (members.seven && this.numbers[7]) {
            this.alertService.alert({
                Type: AlertType.ERROR,
                Message: 'MEMBER_ALREADY_EXIST'
            });
            return;
        } if (members.eight && !this.numbers[8]) {
            this.numbers[8] = true;
        } else if (members.eight && this.numbers[8]) {
            this.alertService.alert({
                Type: AlertType.ERROR,
                Message: 'MEMBER_ALREADY_EXIST'
            });
            return;
        } if (members.nine && !this.numbers[9]) {
            this.numbers[9] = true;
        } else if (members.nine && this.numbers[9]) {
            this.alertService.alert({
                Type: AlertType.ERROR,
                Message: 'MEMBER_ALREADY_EXIST'
            });
            return;
        }
        this.validAddingWorker = true;
    }
    
    unassignsNumber(members: WorkDistributed) {
        if (members.zero) {
            this.numbers[0] = false;
        } if (members.one) {
            this.numbers[1] = false;
        } if (members.two) {
            this.numbers[2] = false;
        } if (members.three) {
            this.numbers[3] = false;
        } if (members.four) {
            this.numbers[4] = false;
        } if (members.five) {
            this.numbers[5] = false;
        } if (members.six) {
            this.numbers[6] = false;
        } if (members.seven) {
            this.numbers[7] = false;
        } if (members.eight) {
            this.numbers[8] = false;
        } if (members.nine) {
            this.numbers[9] = false;
        }
    }
    convertToRequestObject(member: WorkDistributed) {
        let userId = member.member.id;
        let assignedPetitionIds = []

        if (member.zero) {
            assignedPetitionIds.push(0);
        }
        if (member.one) {
            assignedPetitionIds.push(1);
        }
        if (member.two) {
            assignedPetitionIds.push(2);
        }
        if (member.three) {
            assignedPetitionIds.push(3);
        }
        if (member.four) {
            assignedPetitionIds.push(4);
        }
        if (member.five) {
            assignedPetitionIds.push(5);
        }
        if (member.six) {
            assignedPetitionIds.push(6);
        }
        if (member.seven) {
            assignedPetitionIds.push(7);
        }
        if (member.eight) {
            assignedPetitionIds.push(8);
        }
        if (member.nine) {
            assignedPetitionIds.push(9);
        }

        return { "userId": userId, "assignedPetitionIds": assignedPetitionIds };
    }
}
