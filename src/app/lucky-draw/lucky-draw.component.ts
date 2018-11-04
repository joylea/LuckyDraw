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
    if (this.awardsList.length > 0) {
      this.currentAward = this.awardsList[0];
      let hasAllAwardFinished = false;
      for (let i = 0; i < this.awardsList.length; i++) {
        // TODO: fix this logic issue
        for (const finishedItem of this.finishedAwards) {
          console.log(finishedItem.name);
          if (finishedItem !== this.awardsList[i]) {
            hasAllAwardFinished = false;
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
    }
  }

  // draw one award one time.
  startDraw() {
    if (this.isDrawInProgress) {
      const awardWinners = [];
      for (let i = 0; i < this.currentAward.quantity; i++) {
        awardWinners.push(this.doDraw(this.currentAward.allowDuplicate));
      }
      this.winners.push(awardWinners.toString());
      this.finishedAwards.push(this.currentAward);
      this.switchAward();
    }

    this.isDrawInProgress = !this.isDrawInProgress;
    if (this.isDrawInProgress) {
      this.drawButtonText = '停';
    } else {
      this.drawButtonText = '开始抽奖';
    }
  }

  // draw one winner one time
  doDraw(allowDuplicate: boolean): string {
    let tmpWinner = this.participantList[this.getRandomInt()];
    // 如果奖项不允许重复，检查获奖人是否重复，重复了重新抽。
    // TODO: fix this logic issue
    if (!allowDuplicate) {
      let isUserDuplicate = true;
      while (isUserDuplicate) {
        let tmpDuplicate = false;
        for (const item of this.winners) {
          if (item.toString().includes(tmpWinner)) {
            tmpDuplicate = true;
            tmpWinner = this.participantList[this.getRandomInt()];
            break;
          }
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
}
