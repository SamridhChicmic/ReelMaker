import { _decorator, AnimationClip, Component, Node, tween, Vec2, Vec3 } from 'cc';
import { reels } from './reels';

const { ccclass, property } = _decorator;

@ccclass('Tile')
export class Tile extends Component {



    start() {

        this.scheduleOnce(() => {

         


        }, 2);




    }

    update(deltaTime: number) {
        console.log(this.node.getPosition());

    }
}

