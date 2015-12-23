module Adventurer {
    export let list = new Array<AdventurerBehavior>();
    export let currentAdventurer: AdventurerBehavior;
}

enum AdventurerState {
    wantsForQuest,
    waitingForQuest,
    goingForQuest,
    backFromQuest,
    gettingAway
}

class AdventurerBehavior extends Sup.Behavior {
    waypoint: Sup.Math.Vector3;
    speed = 0.01;
    state = AdventurerState.wantsForQuest;
    public sprite: string;
    
    awake() {
        Adventurer.list.push(this);
        this.actor.spriteRenderer.setSprite(this.sprite);
    }

    start() {
        this.spawn();
    }

    update() {
        let self = this;
        let myDistance = this.actor.getPosition().distanceTo(this.waypoint);
        let justBehindAnother = false;
        for (let i = 0; i < Adventurer.list.length; i += 1) {
            let anAdventurer = Adventurer.list[i];
            let hisDistance = anAdventurer.actor.getPosition().distanceTo(this.waypoint);
            if (hisDistance < myDistance && anAdventurer.actor.getPosition().distanceTo(this.actor.getPosition()) < 1) {
                justBehindAnother = true;
                break;
            }
        }
        
        if (justBehindAnother == false) {
            let vectorDiff = this.actor.getPosition().subtract(this.waypoint).negate();
            let direction = (vectorDiff).clone().normalize().multiplyScalar(this.speed);
            if (direction.length() < vectorDiff.length()) {
                this.actor.move(direction);
            }
            else {
                this.actor.move(vectorDiff);
                this.state = AdventurerState.waitingForQuest;
                Adventurer.currentAdventurer = this;
            }
            if (direction.x < 0) {
                this.actor.spriteRenderer.setHorizontalFlip(true);
            }
            else if (direction.x > 0) {
                this.actor.spriteRenderer.setHorizontalFlip(false);
            }
        }
    }

    public spawn() {
        this.waypoint = Sup.getActor("QuestPost").getPosition();
        this.actor.setLocalPosition(new Sup.Math.Vector3(this.waypoint.x + 8, this.waypoint.y + Sup.Math.Random.float(-7, 7), 0));
    }

    public giveQuest() {
        this.state = AdventurerState.goingForQuest;
        this.waypoint = this.waypoint = Sup.getActor("QuestPost").getPosition().add(new Sup.Math.Vector3(8, Sup.Math.Random.float(-7, 7), 0));
        Adventurer.currentAdventurer = null;
    }
}
Sup.registerBehavior(AdventurerBehavior);
