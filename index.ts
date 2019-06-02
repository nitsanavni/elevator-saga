import each from "lodash/each";

type FloorNumber = number;

interface Elevator {
    idle: boolean;
    goToFloor(floorNumber: FloorNumber): void;
    on(event: "idle" | "floor_button_pressed", cb: (param?: FloorNumber) => void): void;
    currentFloor(): FloorNumber;
    destinationQueue: FloorNumber[];
}

interface Floor {
    on(event: "up_button_pressed" | "down_button_pressed", cb: () => void): void;
    floorNum(): FloorNumber;
}

type Seconds = number;

export = {
    init: (elevators: Elevator[], floors: Floor[]) => {
        elevators[1].goToFloor(4);
        each(elevators, (e) => e.on("idle", () => (e.idle = true)));
    },
    update: (dt: Seconds, elevators: Elevator[], floors: Floor[]) => {}
};
