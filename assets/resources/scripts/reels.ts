import { _decorator, animation, Component, instantiate, Node, NodePool, Prefab } from 'cc';
import Animation from './Animation';
const { ccclass, property } = _decorator;

@ccclass('reels')
export class reels extends Component {

    @property({ type: Prefab })
    Tile: Prefab = null;

    tilePool: NodePool = new NodePool();



    start() {
        for (let i = 1; i <= 7; i++) {
            let tile = instantiate(this.Tile)
            this.tilePool.put(tile)

        }
        Animation.setReelDelegate(this);
        
        Animation.playScrollAnimation();
    }

    update(deltaTime: number) {

    }
}

