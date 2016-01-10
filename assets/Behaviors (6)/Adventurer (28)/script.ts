enum AdventurerState {
    wantsForQuest,
    waitingForQuest,
    goingForQuest,
    backFromQuest,
    gettingAway
}

class AdventurerBehavior extends Sup.Behavior {
    waypoint: Sup.Math.Vector3;
    speed = 0.03;
    state = AdventurerState.wantsForQuest;
    questSuccessful = false;
    item: string;
    itemCount: number
    public sprite: string;
    public questTime = 0; // The number of ticks the quest will last
    public questDifficulty = 0; // The chance to win, from 0 to 1
    
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
        if (this.state == AdventurerState.wantsForQuest || this.state == AdventurerState.backFromQuest) {
            for (let i = 0; i < Adventurer.list.length; i += 1) {
                let anAdventurer = Adventurer.list[i];
                let hisDistance = anAdventurer.actor.getPosition().distanceTo(this.waypoint);
                if (hisDistance < myDistance && anAdventurer.actor.getPosition().distanceTo(this.actor.getPosition()) < 1) {
                    justBehindAnother = true;
                    break;
                }
            }
        }
        
        if (justBehindAnother == false) {
            let vectorDiff = this.actor.getPosition().subtract(this.waypoint).negate();
            let direction = (vectorDiff).clone().normalize().multiplyScalar(this.speed);
            if (direction.length() < vectorDiff.length()) {
                this.actor.move(direction);
            }
            else { // Adventurer hit the waypoint
                this.actor.setPosition(this.waypoint);
                if (this.state == AdventurerState.wantsForQuest) {
                    this.waitForQuest();
                }
                else if (this.state == AdventurerState.goingForQuest) {
                    this.inQuest();
                }
                else if (this.state == AdventurerState.backFromQuest) {
                    this.waitForReward();
                }
                else if (this.state == AdventurerState.gettingAway) {
                    this.gone();
                }
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
        this.state = AdventurerState.wantsForQuest;
        this.waypoint = Sup.getActor("QuestPost").getPosition();
        this.actor.setLocalPosition(new Sup.Math.Vector3(this.waypoint.x + 8, this.waypoint.y + Sup.Math.Random.float(-7, 7), 0));
    }

    waitForQuest() {
        this.state = AdventurerState.waitingForQuest;
        Adventurer.currentAdventurer = this;
    }

    public giveQuest(item: string, count: number, questTime: number, questDifficulty: number) {
        this.item = item;
        this.itemCount = count;
        this.state = AdventurerState.goingForQuest;
        this.questTime = questTime;
        this.questDifficulty = questDifficulty;
        if (Adventurer.currentAdventurer = this) {
            Adventurer.currentAdventurer = null;
        }
        this.waypoint = this.waypoint = Sup.getActor("QuestPost").getPosition().add(new Sup.Math.Vector3(8, Sup.Math.Random.float(-7, 7), 0));
    }

    inQuest() {
        this.actor.setVisible(false);
        Adventurer.list.splice(Adventurer.list.indexOf(this, 1));
        Adventurer.inQuest.push(this);
    }

    performQuestTick() {
        this.questTime -= 1;
        if (this.questTime <= 0) {
            this.questSuccessful = Sup.Math.Random.float(0, 1) > this.questDifficulty;
            this.backFromQuest();
        }
    }

    backFromQuest() {
        this.state = AdventurerState.backFromQuest;
        this.actor.setVisible(true);
        Adventurer.inQuest.splice(Adventurer.inQuest.indexOf(this, 1));
        Adventurer.list.push(this);
        this.waypoint = this.waypoint = Sup.getActor("QuestPost").getPosition();
    }

    waitForReward() {
        this.state = AdventurerState.backFromQuest;
        Adventurer.currentAdventurer = this;
    }

    goAway() {
        this.state = AdventurerState.gettingAway;
        this.waypoint = this.waypoint = Sup.getActor("QuestPost").getPosition().add(new Sup.Math.Vector3(8, Sup.Math.Random.float(-7, 7), 0));
    }
    
    gone() {
        this.actor.setVisible(false);
        Adventurer.list.splice(Adventurer.list.indexOf(this, 1));
        Adventurer.pool.push(this);
    }

    public isQuestSuccessfull() {
        Sup.log(this.questSuccessful);
        return this.questSuccessful;
    }

    public getItem() {
        return this.item;
    }
;
    public getItemCount() {
        return this.itemCount
    }
}
Sup.registerBehavior(AdventurerBehavior);
