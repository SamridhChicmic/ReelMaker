import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Slot')
export class Slot extends Component {
    @property({ type: Prefab })
    Machine: Prefab = null;

    protected onLoad(): void {
        let Machine = instantiate(this.Machine)
        this.node.addChild(Machine)
    }
    start() {

    }

    update(deltaTime: number) {

    }
}

