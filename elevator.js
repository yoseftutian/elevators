const numFloors = 10; // Change this value to set the number of floors
const numElevators = 3; // Change this value to set the number of elevators

// Elevator class
class Elevator {
  constructor(id) {
    this.id = id;
    this.currentFloor = 1;
    this.targetFloor = null;
    this.isMoving = false;
    this.direction = 0;
    this.elevatorElement = document.createElement("div");
    this.elevatorElement.className = "elevator";
    this.elevatorElement.id = `elevator-${id}`;
    this.elevatorElement.style.backgroundImage = `url('elv.png')`;
    document.getElementById("building").appendChild(this.elevatorElement);
  }

  moveToFloor(targetFloor) {
    if (!this.isMoving) {
      this.targetFloor = targetFloor;
      this.direction = this.targetFloor > this.currentFloor ? 1 : -1;
      this.moveElevator();
    }
  }

  moveElevator() {
    if (this.targetFloor !== null) {
      this.isMoving = true;
      const moveInterval = setInterval(() => {
        if (this.direction > 0 && this.currentFloor < this.targetFloor) {
          this.currentFloor++;
          this.updateElevatorPosition();
        } else if (this.direction < 0 && this.currentFloor > this.targetFloor) {
          this.currentFloor--;
          this.updateElevatorPosition();
        } else {
          clearInterval(moveInterval);
          this.isMoving = false;
          this.targetFloor = null;
          this.arriveAtFloor();
        }
      }, 500); // Half a second per floor
    }
  }

  updateElevatorPosition() {
    const elevatorTop = (this.currentFloor - 1) * 117; // Floor height + black line height
    this.elevatorElement.style.top = `${elevatorTop}px`;
  }

  arriveAtFloor() {
    const dingSound = new Audio("ding.mp3");
    dingSound.play();
    setTimeout(() => {
      // Elevator door open/close animation or other actions
    }, 2000); // Wait for 2 seconds
  }
}

// Building class
class Building {
  constructor() {
    this.floors = [];
    this.elevators = [];
    this.createFloors();
    this.createElevators();
  }

  createFloors() {
    for (let i = numFloors; i >= 1; i--) {
      const floor = new Floor(i);
      this.floors.push(floor);
    }
  }

  createElevators() {
    for (let i = 0; i < numElevators; i++) {
      const elevator = new Elevator(i);
      this.elevators.push(elevator);
    }
  }

  callElevator(floorNumber) {
    const closestElevator = this.findClosestElevator(floorNumber);
    if (closestElevator) {
      closestElevator.moveToFloor(floorNumber);
    }
  }

  findClosestElevator(floorNumber) {
    let closestElevator = null;
    let minDistance = Infinity;

    for (const elevator of this.elevators) {
      const distance = Math.abs(elevator.currentFloor - floorNumber);
      if (distance < minDistance) {
        minDistance = distance;
        closestElevator = elevator;
      }
    }

    return closestElevator;
  }
}

// Floor class
class Floor {
  constructor(floorNumber) {
    this.floorNumber = floorNumber;
    this.createFloorElement();
    this.createCallButton();
  }

  createFloorElement() {
    const floorElement = document.createElement("div");
    floorElement.className = "floor";
    floorElement.style.height = "110px";

    const blackLine = document.createElement("div");
    blackLine.className = "blackline";
    floorElement.appendChild(blackLine);

    document.getElementById("building").appendChild(floorElement);
  }

  createCallButton() {
    const callButton = document.createElement("button");
    callButton.className = "metal linear elevator-call center";
    callButton.textContent = this.floorNumber;
    callButton.addEventListener("click", () => {
      callButton.style.color = "green";
      building.callElevator(this.floorNumber);
      this.startCountdown(callButton);
    });

    const floorElement =
      document.querySelectorAll(".floor")[numFloors - this.floorNumber];
    floorElement.appendChild(callButton);
  }

  startCountdown(callButton) {
    const countdownElement = document.createElement("span");
    countdownElement.className = "countdown";
    callButton.parentNode.insertBefore(
      countdownElement,
      callButton.nextSibling
    );

    let countdown = 10; // Adjust this value as needed
    const countdownInterval = setInterval(() => {
      countdown--;
      countdownElement.textContent = countdown;

      if (countdown === 0) {
        clearInterval(countdownInterval);
        countdownElement.remove();
        callButton.style.color = "inherit";
      }
    }, 1000);
  }
}

// Create the building and start the application
const building = new Building();
