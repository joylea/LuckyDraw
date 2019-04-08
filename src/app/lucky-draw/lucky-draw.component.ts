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
  isDrawAll = false;
  selectedIndex = 0;

  constructor(private modalService: NgbModal) {
    // 一次性抽完
    this.isDrawAll = false;
    // 参加抽奖名单
    this.participantList = [];
    // 奖项
    const thirdPrize: Award = {
      allowDuplicate: false,
      imageSrc: '',
      name: '优酷会员',
      quantity: 1};
    const secondPrize: Award = {
      allowDuplicate: false,
      imageSrc: '',
      name: '腾讯会员',
      quantity: 1};
   const firstPrize: Award = {
     allowDuplicate: false,
     imageSrc: '',
     name: '充电宝',
     quantity: 1};
    this.awardsList.push(thirdPrize);
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
      } else {
        let hasAllAwardFinished = true;
        let tmpAward: Award;
        // 查看是不是所有奖项都抽过了，如果有没有抽过的，按照list一个个抽
        for (let i = 0; i < this.awardsList.length; i++) {
          let isAwardFinished = false;
          for (const finishedItem of this.finishedAwards) {
            if (this.awardsList[i] === finishedItem) {
              isAwardFinished = true;
              break;
            }
          }
          if (!isAwardFinished) {
            tmpAward = this.awardsList[i];
            hasAllAwardFinished = false;
            break;
          }
        }
        if (!hasAllAwardFinished) {
          this.currentAward = tmpAward;
        } else {
          this.drawFinished = true;
		      this.selectedIndex = 2;
        }
      }
    } else {
      this.drawFinished = true;
	    this.selectedIndex = 2;
    }
  }

  // draw one award one time.
  startDraw() {
    this.isDrawInProgress = true;
  }
  stopDraw() {
    if (this.isDrawAll) {
      while (!this.drawFinished)
      {
        this.oneDraw();
        this.switchAward();
        this.isDrawInProgress = true;
      }
      this.currentWinner = '恭喜各位中奖者，请查看中奖名单';
      this.selectedIndex = 2;
    } else {
      this.oneDraw();
    }
  }
  
	oneDraw() {
		if (this.isDrawInProgress) {
      const awardWinners = [];
      for (let i = 0; i < this.currentAward.quantity; i++) {
        awardWinners.push(this.doDraw(this.currentAward.allowDuplicate));
        this.currentWinner = awardWinners.toString();
      }
      this.winners.push(awardWinners.toString());
      this.finishedAwards.push(this.currentAward);
      
    }
    this.isDrawInProgress = false;
	}

  // draw one winner one time
  doDraw(allowDuplicate: boolean): string {
    let tmpWinner = this.participantList[this.getRandomInt()];
    // 如果奖项不允许重复，检查获奖人是否重复，重复了重新抽。
    if (!allowDuplicate) {
      // 检查是不是所有用户都中过奖了
      let isAllUserWinner = true;
      for (const user in this.participantList) {
        if (!this.isUserWinner(user))
        {
          isAllUserWinner = false;
          break;
        }
      }
      // 如果都中过奖了，返回空字符串（没人能中奖了）。
      if (isAllUserWinner) {
        return '';
      }
      // 如果当前中奖者中过奖，换人重新随机
      while (this.isUserWinner(tmpWinner)) {
        tmpWinner = this.participantList[this.getRandomInt()];
      }
    }
    return tmpWinner;
  }

  isUserWinner(userName: string): Boolean {
    let result = false;
    for (const item of this.winners) {
      console.log(item.toString());
      if (item.toString().includes(userName)) {
        result = true;
        break;
      }
    }
    if (this.currentWinner.includes(userName)) {
      result = true;
    }
    return result;
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
    this.switchAward();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  onIsDrawAllChange(){
    this.isDrawAll = !this.isDrawAll;
  }
}
