import each from "lodash/each";
import some from "lodash/some";
import minBy from "lodash/minBy";

type FloorNumber = number;

interface Elevator {
    goToFloor(floorNumber: FloorNumber): void;
    on: ((event: "floor_button_pressed" | "stopped_at_floor", cb: (f: FloorNumber) => void) => void) &
        ((event: "idle", cb: () => void) => void) &
        ((event: "passing_floor", cb: (f: FloorNumber, direction: "up" | "down") => void) => void);
    currentFloor(): FloorNumber;
    goingUpIndicator: (value: boolean | void) => void | boolean;
    goingDownIndicator: (value: boolean | void) => void | boolean;
    getPressedFloors(): FloorNumber[];
    destinationQueue: Array<FloorNumber>;
    checkDestinationQueue(): void;
    destinationDirection(): "up" | "down" | "stopped";
    loadFactor(): number;
    maxPassengerCount(): number;
}

interface Floor {
    on(event: "up_button_pressed" | "down_button_pressed", cb: (floor: FloorNumber) => void): void;
    floorNum(): FloorNumber;
}

type Seconds = number;

const init = (elevators: Elevator[], floors: Floor[]) => {
    const n = (f: FloorNumber | Floor): number => (typeof f == "number" ? f : f.floorNum());
    const queued = (e: Elevator, f: FloorNumber | Floor): boolean => e.destinationQueue.includes(n(f));
    const queuedOnAnyElevator = (f: FloorNumber | Floor) => some(elevators, (e) => queued(e, f));
    const go = (e: Elevator, f: FloorNumber | Floor) => {
        if (!queued(e, f)) e.goToFloor(n(f));
    };
    const goIfFirst = (e: Elevator, f: FloorNumber | Floor) => {
        if (!queuedOnAnyElevator(n(f))) go(e, f);
    };
    const up = (e: Elevator) => (e.currentFloor() + 1) % floors.length;
    const goUp = (e: Elevator) => go(e, up(e));
    const onCall = (f: Floor, cb: (f: FloorNumber) => void) => {
        f.on("up_button_pressed", cb);
        f.on("down_button_pressed", cb);
    };
    const allGo = (f: FloorNumber) => elevators.map((e) => goIfFirst(e, f));

    const leastBusy: () => Elevator = () => minBy(elevators, (e) => e.destinationQueue.length) as Elevator;
    const sendLeastBusyElevator = (n: FloorNumber) => go(leastBusy(), n);

    // TODO - closest elevator
    // TODO - rearrange the destination queue to be linear
    // TODO - use the goingUpIndicator / Down
    // TODO - use the Elevator.loadFactor (isEmpty / isFull)
    // TODO - use the Elevator.getPressedFloors
    // TODO -

    each(floors, (f) => onCall(f, sendLeastBusyElevator));
    each(elevators, (e) => e.on("floor_button_pressed", (n: FloorNumber) => go(e, n)));
};

export = {
    init,
    update: (dt: Seconds, elevators: Elevator[], floors: Floor[]) => {}
};
