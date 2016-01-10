module Adventurer {
    export let list = new Array<AdventurerBehavior>();
    export let inQuest = new Array<AdventurerBehavior>();
    export let pool = new Array<AdventurerBehavior>();
    export let currentAdventurer: AdventurerBehavior;
}

class AdventurerManagerBehavior extends Sup.Behavior {
    public waitTime = 15 * 60;
    currentWaitTimeTick = 0;
    public queueLength = 8;
    
    awake() {
        this.createAdventurer().spawn();
    }

    update() {
        this.currentWaitTimeTick += 1;
        
        if (this.currentWaitTimeTick >= this.waitTime && Adventurer.list.length < this.queueLength) {
            this.createAdventurer().spawn();
            this.currentWaitTimeTick = 0;
        }
        Adventurer.inQuest.forEach(function (adventurer) {
            adventurer.performQuestTick();
        });
    }
    
    createAdventurer() {
        if (Adventurer.pool.length < 1) {
            let newAdventurerActor = new Sup.Actor("Adventurer", this.actor);
            newAdventurerActor.setLocalEulerAngles(new Sup.Math.Vector3(Sup.Math.toRadians(1), 0, 0));
            new Sup.SpriteRenderer(newAdventurerActor);
            let newAdventurer = newAdventurerActor.addBehavior(AdventurerBehavior, {sprite: "Characters/Character1"});
            Adventurer.list.push(newAdventurer);
            return newAdventurer;
        }
        else {
            let reuseAdventurer = Adventurer.list.pop();
            Adventurer.list.push(reuseAdventurer);
        }
    }

}
Sup.registerBehavior(AdventurerManagerBehavior);
