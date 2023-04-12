import { _decorator, Button, Component, Node } from 'cc';

import { Slot } from '../Slot';
const { ccclass, property } = _decorator;

@ccclass('HUD')
export class HUD extends Component {

    @property(Node)
    spinButton: Node = null;


    slotDelegate: Slot = null;

    set setSlotDelegate(slot) {
        this.slotDelegate = slot;
    }

    start() {
        
    }

    play(event) {
        console.log(event);
        // this.spinButtonInteraction(false)
        this.slotDelegate.spin();
    }



    spinButtonInteraction(interaction) {
        this.spinButton.getComponent(Button).interactable = interaction;

    }

    update(deltaTime: number) {

    }
}

