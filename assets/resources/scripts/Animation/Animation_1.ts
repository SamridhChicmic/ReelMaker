import { _decorator, Animation, animation, AnimationClip, Component, instantiate, log, Node, NodePool, Prefab, resources, SpriteFrame, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Animation_1')
export class Animation_1 extends Component {
    drumsArray = [];

    @property(Prefab)
    popUpPrefab: Prefab = null;
    popUpNode = null;
    poolSize = 15;
    popupPool = new NodePool();


    protected onLoad(): void {
        resources.loadDir("sprites/Drumscompressed", SpriteFrame, (err, dir) => {
            if (!err) {
                this.drumsArray = dir;
                console.log(this.drumsArray)
            }
        })
    }


    start() {
        for (let index = 0; index < this.poolSize; index++) {
            let PopupNode = instantiate(this.popUpPrefab);
            this.popupPool.put(PopupNode);
        }

    }



    setNodePosition(pos) {
        this.node.setPosition(pos);
    }



    playAnimation(tileNode, reelNode) {
        // console.log("this.popupPool.size", this.popupPool.size())
        if (this.popupPool.size()) {
            let node = this.popupPool.get();
            console.log("Tile node from animation script", tileNode.getWorldPosition());
            node.setPosition(tileNode.getWorldPosition().x, tileNode.getWorldPosition().y);
            this.node.addChild(node);
            let clip = AnimationClip.createWithSpriteFrames(this.drumsArray, this.drumsArray.length);
            let animation = node.getComponent(Animation);
            let anim = animation.createState(clip, "Drum");
            anim.speed = 1;
            anim.repeatCount = 100;
            anim.play()
        }
    }

    stopAnimation() {
        while (this.node.children.length > 0) {
            let node = this.node.children.pop();
            setTimeout(() => {
                this.popupPool.put(instantiate(this.popUpPrefab))
                node.destroy();
            })
        }
    }


    update(deltaTime: number) {

    }
}

