import { _decorator, Button, Component, Node } from 'cc';
import { Machine } from '../Machine';
const { ccclass, property } = _decorator;

@ccclass('HUD')
export class HUD extends Component {

    @property(Node)
    spinButton: Node = null;


    slotDelegate: Machine = null;

    set setSlotDelegate(machine) {
        this.slotDelegate = machine;
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

