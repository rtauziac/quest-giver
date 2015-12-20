module Adventurer {
    export let list = new Array<AdventurerBehavior>();
}

enum AdventurerState {
    waitingForQuest,
    goingForQuest,
    backFromQuest,
    gettingAway
}

class AdventurerBehavior extends Sup.Behavior {
    waypoint: Sup.Math.Vector3;
    speed = 0.01;
    state = AdventurerState.waitingForQuest;
    
    awake() {
        Adventurer.list.push(this);
    }

    update() {
        let self = this;
        let myDistance = this.actor.getLocalPosition().distanceTo(this.waypoint);
        for (let i = 0; i < Adventurer.list.length; i += 1) {
            let anAdventurer = Adventurer.list[i];
            let hisDistance = anAdventurer.actor.getLocalPosition().distanceTo(this.waypoint);
            if (hisDistance >= myDistance) {
                let direction = (this.waypoint.subtract(this.actor.getLocalPosition())).normalize();
                this.actor.moveLocal(direction.multiplyScalar(this.speed));
            }
        }
    }
}
Sup.registerBehavior(AdventurerBehavior);
