import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameData')
export class GameData {

    private popOutAnimNodeRef: any = null!;
    private static _instance: GameData;

    static get Instance(): GameData {
        if (!GameData._instance) {
            GameData._instance = new GameData();
        }
        return GameData._instance;
    }

    set PopOutAnimNodeRef(popOutAnimNodeRef: any) {
        this.popOutAnimNodeRef = popOutAnimNodeRef;
    }

    get PopOutAnimNodeRef(): any {
        return this.popOutAnimNodeRef;
    }

}

