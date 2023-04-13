import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { HUD } from './HUD/HUD';
import { Machine } from './Machine';
import { ANIMATION_TYPES } from './AnimationTypes';
import { GameData } from './Common/GameData';
const { ccclass, property } = _decorator;

@ccclass('Slot')
export class Slot extends Component {

    @property(Prefab)
    HUD: Prefab = null;

    @property(Node)
    Machine: Node = null;

    @property(Node)
    popUpAnimationNodeRef:Node= null;

    hudScript = null;
    protected onLoad(): void {
        GameData.Instance.PopOutAnimNodeRef = this.popUpAnimationNodeRef;
        let hud = instantiate(this.HUD);
        this.hudScript = hud.getComponent(HUD);
        this.node.addChild(hud);
        this.hudScript.setSlotDelegate = this;

    }

    spin() {
        let machineScript = this.Machine.getComponent(Machine);
        // if (machineScript.ReelSpin.name == ANIMATION_TYPES.REELSPIN) { machineScript.spin(); }
        // else {
        if (machineScript.reelScriptName == ANIMATION_TYPES.REELSPIN) { machineScript.spin(); }
        else {
            machineScript.drop();
        }
        // }
        machineScript.hudScriptCatcher(this.hudScript);
    }

    start() {

    }

    update(deltaTime: number) {

    }
}

