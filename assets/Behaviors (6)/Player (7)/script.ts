class PlayerBehavior extends Sup.Behavior {
    public moveSpeed = 0.1;
    movable = true;
    controllable = true;
    lastKeyDown: string;

    awake() {
        
    }

    update() {
        let dirVec = new Sup.Math.Vector2();
        
        Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());
        if (this.controllable) {
            if (Sup.Input.isKeyDown("UP")) {
                dirVec.add(Sup.Math.Vector2.up());
                this.lastKeyDown = "UP";
                this.actor.spriteRenderer.setHorizontalFlip(false);
            }
            if (Sup.Input.isKeyDown("DOWN")) {
                dirVec.add(Sup.Math.Vector2.down());
                this.lastKeyDown = "DOWN";
                this.actor.spriteRenderer.setHorizontalFlip(false);
            }
            if (Sup.Input.isKeyDown("RIGHT")) {
                dirVec.add(Sup.Math.Vector2.right());
                this.lastKeyDown = "RIGHT";
                this.actor.spriteRenderer.setHorizontalFlip(false);
            }
            if (Sup.Input.isKeyDown("LEFT")) {
                dirVec.add(Sup.Math.Vector2.left());
                this.lastKeyDown = "LEFT";
                this.actor.spriteRenderer.setHorizontalFlip(true);
            }
            
            if (Sup.Input.wasKeyJustPressed("X")) { // Do an action
                let position = this.actor.getLocalPosition().add(new Sup.Math.Vector3(-0.5, -0.5, 0));
                if (this.lastKeyDown == "UP") {
                    position.add(Sup.Math.Vector3.up());
                }
                if (this.lastKeyDown == "DOWN") {
                    position.add(Sup.Math.Vector3.down());
                }
                if (this.lastKeyDown == "LEFT") {
                    position.add(Sup.Math.Vector3.left());
                }
                if (this.lastKeyDown == "RIGHT") {
                    position.add(Sup.Math.Vector3.right());
                }
                let targetTilePos = new Sup.Math.Vector2(Math.round(position.x), Math.round(position.y));
                let mapRenderer = Sup.getActor("Map").tileMapRenderer;
                let targetTile = mapRenderer.getTileMap().getTileAt(2, targetTilePos.x, targetTilePos.y);
                if (mapRenderer.getTileSet().getTileProperties(targetTile)["action"] == "menuQuest") {
                    if (Adventurer.currentAdventurer != null) {
                        let currAdventurer = Adventurer.currentAdventurer;
                        if (currAdventurer.state == AdventurerState.waitingForQuest) {
                            Sup.getActor("Chat box").getBehavior(ChatBoxBehavior).showDialog([{text:DialogTexts.player_ask_quest[Sup.Math.Random.integer(0, DialogTexts.player_ask_quest.length - 1)], name:"Player", sprite:"Characters/Character1", action:function(){
                                Sup.getActor("MenuQuest").getBehavior(MenuGiveQuestBehavior).setFocus(true);
                                Sup.Audio.playSound("Selection3");
                            }}]);
                            this.controllable = false;
                        }
                        else if (currAdventurer.state == AdventurerState.backFromQuest) {
                            if (currAdventurer.isQuestSuccessfull()) {
                                let dialog1 = DialogTexts.player_quest_successful[Sup.Math.Random.integer(0, DialogTexts.player_quest_successful.length - 1)].replace("{item}", currAdventurer.getItem()).replace("{itemCount}", currAdventurer.getItemCount().toString());
                                let dialog2 = DialogTexts.player_quest_reward[Sup.Math.Random.integer(0, DialogTexts.player_quest_reward.length - 1)];
                                Sup.getActor("Chat box").getBehavior(ChatBoxBehavior).showDialog([{text: dialog1, name: "Player", sprite: "Characters/Character1"},
                                                                                                  {text: dialog2, name: "Player", sprite: "Characters/Character1", action:function(){
                                Sup.getActor("Player").getBehavior(PlayerBehavior).giveControlBack();
                                currAdventurer.goAway();
                            }}]);
                            }
                            else {
                                let dialog = DialogTexts.player_quest_fail[Sup.Math.Random.integer(0, DialogTexts.player_quest_fail.length - 1)];
                                Sup.getActor("Chat box").getBehavior(ChatBoxBehavior).showDialog([{text: dialog, name:"Player", sprite:"Characters/Character1", action:function(){
                                Sup.getActor("Player").getBehavior(PlayerBehavior).giveControlBack();
                                Adventurer.currentAdventurer.goAway();
                            }}]);
                            }
                            this.controllable = false;
                        }
                    }
                }
            }
        }
        
        let animationDirection = "Side";
        if (this.lastKeyDown == "UP") {
            animationDirection = "Back";
        }
        if (this.lastKeyDown == "DOWN") {
            animationDirection = "Face";
        }
        if (dirVec.length() > 0) {
            this.actor.arcadeBody2D.setVelocity(dirVec.normalize().multiplyScalar(this.moveSpeed));
            this.actor.spriteRenderer.setAnimation("Walk"+animationDirection);
        }
        else {
            this.actor.arcadeBody2D.setVelocity(new Sup.Math.Vector2(0, 0));
            this.actor.spriteRenderer.setAnimation("Idle"+animationDirection);
        }
    }

    public giveControlBack() {
        this.controllable = true;
    }
}
Sup.registerBehavior(PlayerBehavior);
