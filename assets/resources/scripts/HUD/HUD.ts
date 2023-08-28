import { _decorator, Button, Component, Node } from "cc";

import { Slot } from "../Slot";
import { Machine } from "../Machine";
const { ccclass, property } = _decorator;

@ccclass("HUD")
export class HUD extends Component {
  @property(Node)
  spinButton: Node = null;

  slotDelegate: Slot = null;
  MachineDelegate: Machine = null;
  set setSlotDelegate(slot) {
    this.slotDelegate = slot;
  }
  set setMachineDelegate(Machine) {
    this.MachineDelegate = Machine;
  }
  start() {}
  spinButtonClicked(event) {
    // this.spinButtonInteraction(false)
    //this.slotDelegate.spin();
    this.MachineDelegate.reelAnimation();
    this.MachineDelegate.hudScriptCatcher(this);
  }

  spinButtonInteraction(interaction) {
    this.spinButton.getComponent(Button).interactable = interaction;
  }

  update(deltaTime: number) {}
}
