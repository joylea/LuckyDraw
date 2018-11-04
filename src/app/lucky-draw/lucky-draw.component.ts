import { Component, OnInit } from '@angular/core';
import {Award} from '../model/award.model';

@Component({
  selector: 'app-lucky-draw',
  templateUrl: './lucky-draw.component.html',
  styleUrls: ['./lucky-draw.component.css']
})
export class LuckyDrawComponent implements OnInit {
  drawFinished = false;
  participantList = [];
  awardsList: Award[] = [];
  currentAward: Award;
  finishedAwards: Award[] = [];
  winners = [];
  currentAwardLeft = 0;
  drawButtonText = '开始抽奖';
  isDrawInProgress = false;
  displayText = '';

  constructor() {
    this.participantList = ['Gloria', 'Rita', 'Cecilia', 'Cary', 'Danny', 'Joe'];
    const secondPrize: Award = {
      allowDuplicate: false,
      imageSrc: '../../assets/image/2.jpg',
      name: '蛋糕',
      quantity: 3};
    const firstPrize: Award = {
      allowDuplicate: true,
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
    if (this.currentAwardLeft === 0 && this.awardsList.length > 0) {
      for (let i = 0; i < this.awardsList.length; i++) {
        let hasAllAwardFinished = false;
        for (const finishedItem of this.finishedAwards) {
          if (finishedItem === this.awardsList[i]) {
            hasAllAwardFinished = true;
            break;
          }
        }
        if (!hasAllAwardFinished) {
          this.currentAward = this.awardsList[i];
          break;
        } else {
          this.drawFinished = true;
        }
      }
      this.currentAward = this.awardsList[0];
    }
  }

  startDraw() {
    if (this.isDrawInProgress) {
      for (let i = 0; i < this.currentAward.quantity; i++) {
        this.doDraw(this.currentAward.allowDuplicate);
      }
    }

    this.isDrawInProgress = !this.isDrawInProgress;
    if (this.isDrawInProgress) {
      this.drawButtonText = '停';
    } else {
      this.drawButtonText = '开始抽奖';
    }
  }

  doDraw(allowDuplicate: boolean) {
    const currentAwardList = [];
    for (let i = 0; i < this.currentAward.quantity; i++) {
      let tmpWinner = this.participantList[this.getRandomInt()];
      if (!allowDuplicate) {
        let isUserDuplicate = true;
        while (isUserDuplicate) {
          isUserDuplicate = false;
          for (const index in this.winners) {
            if (tmpWinner in this.winners[index]) {
              isUserDuplicate = true;
              tmpWinner = this.participantList[this.getRandomInt()];
              break;
            }
          }
        }
      }
      currentAwardList.push(tmpWinner);
    }
    this.winners.push(currentAwardList.toString());
  }

  getRandomInt(): number {
    const max = this.participantList.length - 1;
    const min = 0;
    const Range = max - min;
    const Rand = Math.random();
    return(min + Math.round(Rand * Range));
  }
}
