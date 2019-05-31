export default {
    init: (elevators, floors) => {
        const some = (array, predicate) => {
            var index = -1,
                length = array == null ? 0 : array.length;

            while (++index < length) {
                if (predicate(array[index], index, array)) {
                    return true;
                }
            }
            return false;
        };
        const n = (f) => (typeof f == "number" ? f : f.floorNum());
        const queued = (e, f) => e.destinationQueue.includes(n(f));
        const queuedOnAnyElevator = (f) => some(elevators, (e) => queued(e, f));
        const go = (e, f) => {
            if (!queued(e, f)) e.goToFloor(n(f));
        };
        const goIfFirst = (e, f) => {
            if (!queuedOnAnyElevator(n(f))) go(e, f);
        };
        const up = (e) => (e.currentFloor() + 1) % floors.length;
        const goUp = (e) => go(e, up(e));
        const onCall = (f, cb) => {
            f.on("up_button_pressed", cb);
            f.on("down_button_pressed", cb);
        };
        const log = (e) => console.log(e);
        const allGo = (f) => elevators.map((e) => goIfFirst(e, f));

        floors.map((f) => onCall(f, allGo));
        elevators.map((e) => e.on("floor_button_pressed", (n) => go(e, n)));
    },
    update: (dt, elevators, floors) => {}
};
