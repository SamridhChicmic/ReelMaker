import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('gameData')
export class gameData {

    private static _instance = null;
    // private tileRef = null;
    private static gameData() {

    }


    public static getInstance() {
        if (this._instance == null) {
            this._instance = new gameData();
        }

        return this._instance;
    }


    tileRef = []
    tileRefOriginal =[];

    pushTileRef(data) {
        this.tileRef.push(data);
    }

    getTileRefArr() {
       
        return this.tileRef;
    }

    set initTileRef(tileRef) {
        this.tileRef = tileRef;
    }

    get initTileRef() {
        return this.tileRef;
    }

    

   
}

