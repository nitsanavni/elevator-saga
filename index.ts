type FloorNumber = number;

interface Elevator {
    goToFloor(floorNumber: FloorNumber): void;
    on(event: "idle" | "floor_button_pressed", cb: (param?: FloorNumber) => void): void;
    currentFloor(): FloorNumber;
    destinationQueue: FloorNumber[];
}

interface Floor {
    on(event: "up_button_pressed" | "down_button_pressed", cb: () => void): void;
    floorNum(): FloorNumber;
}

export default {
    init: (elevators: Elevator[], floors: Floor[]) => {},
    update: (dt, elevators: Elevator[], floors: Floor[]) => {}
};
