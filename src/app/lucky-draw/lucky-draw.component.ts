import { Component, OnInit } from '@angular/core';
import {Award} from '../model/award.model';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lucky-draw',
  templateUrl: './lucky-draw.component.html',
  styleUrls: ['./lucky-draw.component.css'],
})
export class LuckyDrawComponent implements OnInit {
  drawFinished = false;
  participantList = [];
  awardsList: Award[] = [];
  currentAward: Award;
  currentWinner = '';
  finishedAwards: Award[] = [];
  winners = [];
  isDrawInProgress = false;
  displayText = '';
  closeResult: string;

  constructor(private modalService: NgbModal) {
    this.participantList = ['Gloria', 'Rita', 'Cecilia', 'Cary', 'Danny', 'Joe'];
    const secondPrize: Award = {
      allowDuplicate: false,
      imageSrc: '../../assets/image/2.jpg',
      name: '蛋糕',
      quantity: 3};
    const firstPrize: Award = {
      allowDuplicate: false,
      imageSrc: '../../assets/image/1.jpg',
      name: '手机',
      quantity: 1};
    this.awardsList.push(secondPrize);
    this.awardsList.push(firstPrize);
  }

  ngOnInit() {
    this.switchAward();
    setInterval(() => {
      this.displayText = this.participantList[this.getRandomInt()];
    }, 100);
  }

  switchAward() {
    if (this.awardsList.length > 0) {
      if (!this.currentAward) {
        this.currentAward = this.awardsList[0];
      }
      let hasAllAwardFinished = true;
      let tmpAward: Award;
      for (let i = 0; i < this.awardsList.length; i++) {
        let isCurrentAwardFinished = false;
        for (const finishedItem of this.finishedAwards) {
          if (this.awardsList[i] === finishedItem) {
            isCurrentAwardFinished = true;
            break;
          }
        }
        if (isCurrentAwardFinished === false) {
          tmpAward = this.awardsList[i];
          hasAllAwardFinished = false;
          break;
        }
      }
      if (!hasAllAwardFinished) {
        this.currentAward = tmpAward;
      } else {
        this.drawFinished = true;
      }
    } else {
      this.drawFinished = true;
    }
  }

  // draw one award one time.
  startDraw() {
    this.isDrawInProgress = !this.isDrawInProgress;
  }
  stopDraw() {
    if (this.isDrawInProgress) {
      const awardWinners = [];
      for (let i = 0; i < this.currentAward.quantity; i++) {
        awardWinners.push(this.doDraw(this.currentAward.allowDuplicate));
        this.currentWinner = awardWinners.toString();
      }
      this.winners.push(awardWinners.toString());
      this.finishedAwards.push(this.currentAward);
      this.switchAward();
    }
    this.isDrawInProgress = !this.isDrawInProgress;
  }

  // draw one winner one time
  doDraw(allowDuplicate: boolean): string {
    let tmpWinner = this.participantList[this.getRandomInt()];
    // 如果奖项不允许重复，检查获奖人是否重复，重复了重新抽。
    if (!allowDuplicate) {
      let isUserDuplicate = true;
      while (isUserDuplicate) {
        let tmpDuplicate = false;
        for (const item of this.winners) {
          console.log(item.toString());
          if (item.toString().includes(tmpWinner)) {
            tmpDuplicate = true;
            tmpWinner = this.participantList[this.getRandomInt()];
            break;
          }
        }
        if (this.currentWinner.includes(tmpWinner)) {
          tmpDuplicate = true;
          tmpWinner = this.participantList[this.getRandomInt()];
        }
        if (!tmpDuplicate) {
          isUserDuplicate = tmpDuplicate;
        }
      }
    }
    return tmpWinner;
  }

  getRandomInt(): number {
    const max = this.participantList.length - 1;
    const min = 0;
    const Range = max - min;
    const Rand = Math.random();
    return(min + Math.round(Rand * Range));
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
}
