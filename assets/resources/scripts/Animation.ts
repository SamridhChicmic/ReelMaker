import { _decorator, Component, instantiate, Node, Scheduler, Tween, tween, Vec3 } from 'cc';
import { reels } from './reels';
const { ccclass, property } = _decorator;

@ccclass('Animation')
class Animation {
    reelDelegate: reels = null;

    setReelDelegate(delegate) {
        this.reelDelegate = delegate;
    }
    private static _instance = null;


    static getInstance() {
        if (Animation._instance == null) {

            Animation._instance = new Animation();
        }
        return Animation._instance;
    }

    playScrollAnimation() {
        let tilePool = this.reelDelegate.tilePool;
        while (tilePool.size() != 0) {
            let tile = tilePool.get();
            this.reelDelegate.node.addChild(tile);


        }

        this.reelDelegate.node.children.forEach((tile) => {
            let scrollTween = tween(tile).to(2, { position: new Vec3(0, -1000, 0) }).call(() => {


                if (tile.getPosition().y <= -1000) {
                    tile.setPosition(new Vec3(0, 100 * i, 0));

                    scrollTween.start()
                }
            }).start();
        })

    }


}

export default Animation.getInstance();