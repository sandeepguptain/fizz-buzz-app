import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'FizzBuzz App';
  answer:any;
  curentNumber: number;
  oldnumbers = [];
  isAutoModeStopped:boolean = false;
  showLoader:boolean = false;
  interval:any;
  timeLeft: number = 60;
  
  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getNumber()
  }

  getNumber() {
    this.showLoader = true;
    this.http.get('https://numup.herokuapp.com/getNumber')
      .subscribe(
        (data:any) => {
          this.curentNumber = data.data
          // this.oldnumbers = Array(this.curentNumber).fill(0).map((x, i) => i + 1).sort((a, b) => b - a);
          this.oldnumbers.push(this.curentNumber);
          this.oldnumbers.sort((a, b) => b - a);
          this.getFizzBuss()
          this.showLoader = false;
        }, err => {
          if(err.status==500){
            const r = confirm(`There is a ${err.statusText} \n press 'OK' to continue or 'Cancel' to pause`);
            if (r == true) {
              this.getNumber()
            } else {
              this.pauseTimer()
            }
          }
          this.showLoader = false;
        }
      );
  }

  getFizzBuss(){
    let i = this.curentNumber;
      this.answer = i%15===0 ? 'Fizzbuzz' :  i%5===0 ? 'Buzz' :   i%3===0 ? 'Fizz' : i;
  }

  resetNumber() {
    this.http.post('https://numup.herokuapp.com/reset', '')
      .subscribe(
        (data) => {
          this.oldnumbers = []
          this.getNumber()
          this.pauseTimer()
        }
      )
  }

  startTimer() {
    this.interval = setInterval(() => {
        this.getNumber();
    },3000)
    this.isAutoModeStopped = true
  }

  pauseTimer() {
    clearInterval(this.interval);
    this.isAutoModeStopped = false
  }

}
