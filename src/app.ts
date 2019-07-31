/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {
    Actor,
    AnimationEaseCurves,
    Asset,
    AssetContainer,
    ButtonBehavior,
    Context,
    PrimitiveShape,
    Quaternion,
    User,
    Vector3,
} from '@microsoft/mixed-reality-extension-sdk';
/**
 * The main class of this app. All the logic goes here.
 */
export default class GalleryGame {
    private spheresRootActor: Actor;
    private dartsRootActor: Actor;
    private scoreAndTimerRootActor: Actor;
    private playerOne: Actor;
    private galleryGameScore: Actor;
    private galleryGameRoundTimer: Actor;
    public blue100Sphere: Actor;
    private blue100SphereArray: Actor[] = [];
    public red200Sphere: Actor;
    private red200SphereArray: Actor[] = [];
    public green300Sphere: Actor;
    private green300SphereArray: Actor[] = [];
    public purple500Sphere: Actor;
    private purple500SphereArray: Actor[] = [];
    private score: number;
    private timer: number;
    private assets: AssetContainer;
    public desk: Actor;
    private deskAsset: Asset[] = [];
    public dart: Actor;
    public grabbedDart: Actor;
    public throwDart: Actor;
    public dartsArray: Actor[] = [];
    private dartAssets: Asset[] = [];
    public gamePlayButton: Actor;
    private gamePlayButtonAsset: Asset[] = [];

    constructor(private context: Context, private baseUrl: string) {
        this.context.onStarted(async () => await this.started());
        this.context.onUserJoined(user => this.userJoined(user));
        this.assets = new AssetContainer(context);
    }

    // --------------------------------------------------------------------------------------------
    private userJoined(user: User) {
        this.playerOne = Actor.CreateEmpty(this.context, {
            actor: {
                subscriptions: ['transform'],
                attachment: {
                    userId: user.id,
                    attachPoint: 'center-eye',
                },
                name: 'Player Center Eye',
            },
        });
    }

    // --------------------------------------------------------------------------------------------
    private async started() {
        this.createSpheresRootActor();
        this.createDartsRootActor();
        this.createScoreAndTimerActor();
        await this.preloadAssets();
        await this.createDarts();
        await this.createDesk();
        this.createGalleryGameScore();
        this.createGalleryGameRoundTimer();
        this.createBlue100sphere();
        this.createRed200sphere();
        this.createGreen300sphere();
        this.createPurple500sphere();
        this.createPlayButton();
        this.startGame();
    }

    // --------------------------------------------------------------------------------------------
    private async preloadAssets() {
        // tslint:disable: max-line-length
        return Promise.all([
            this.assets.loadGltf(`${this.baseUrl}/Table.glb`, 'mesh').then(assets => this.deskAsset = assets),
            this.assets.loadGltf(`${this.baseUrl}/11750_throwing_dart_v1_L3.glb`, 'mesh').then(assets => this.dartAssets = assets),
            this.assets.loadGltf(`${this.baseUrl}/Play Button.glb`, 'mesh').then(assets => this.gamePlayButtonAsset = assets),
        ]);
    }

    // --------------------------------------------------------------------------------------------
    private createSpheresRootActor() {
        this.spheresRootActor = Actor.CreateEmpty(this.context);
    }

    // --------------------------------------------------------------------------------------------
    private createDartsRootActor() {
        this.dartsRootActor = Actor.CreateEmpty(this.context);
    }

    // --------------------------------------------------------------------------------------------
    private createScoreAndTimerActor() {
        this.scoreAndTimerRootActor = Actor.CreateEmpty(this.context);
    }

    // --------------------------------------------------------------------------------------------
    private createGalleryGameScore() {
        this.score = 0;
        this.galleryGameScore = Actor.CreateEmpty(this.context, {
            actor: {
                name: 'Score',
                parentId: this.scoreAndTimerRootActor.id,
                transform: {
                    local: { position: { x: 0, y: 4, z: 0 } }
                },
                text: {
                    contents: `Gallery Game Score: ${this.score}`,
                    color: { r: 30 / 255, g: 206 / 255, b: 213 / 255 },
                    height: 0.29,
                },
            }
        });
    }

    // --------------------------------------------------------------------------------------------
    private createGalleryGameRoundTimer() {
        this.timer = 30;
        this.galleryGameRoundTimer = Actor.CreateEmpty(this.context, {
            actor: {
                name: 'Timer',
                parentId: this.scoreAndTimerRootActor.id,
                transform: {
                    local: { position: { x: 0, y: 0, z: 0 } }
                },
                text: {
                    contents: `Gallery Game Timer: ${this.timer}`,
                    color: { r: 30 / 255, g: 206 / 255, b: 213 / 255 },
                    height: 0.29,
                },
            }
        });
    }

    // --------------------------------------------------------------------------------------------
    private createBlue100sphere() {
        const blue100SphereCount = 12;
        for (let blue100SphereIndexX = 0; blue100SphereIndexX < blue100SphereCount; blue100SphereIndexX++) {
            const blue100Sphere = Actor.CreatePrimitive(this.context, {
                definition: {
                    shape: PrimitiveShape.Sphere,
                    radius: 0.9,
                    uSegments: 8,
                    vSegments: 4
                },
                addCollider: true,
                actor: {
                    name: 'Blue Sphere',
                    parentId: this.spheresRootActor.id,
                    transform: {
                        local: {
                            position: { x: 7 - (blue100SphereIndexX), y: .8, z: 0 },
                            scale: { x: 0.3, y: 0.4, z: 0.3 },
                        }
                    },
                }
            });
            blue100Sphere.created().then(() => {
                blue100Sphere.collider.isTrigger = true;
                blue100Sphere.collider.onTrigger('trigger-enter', (otherActor: Actor) => {
                    if (otherActor.parent.name === "throwing_dart") {
                        this.score += 100;
                        this.galleryGameScore.text.contents = `Gallery Game Score: ${this.score}`,
                            blue100Sphere.destroy();
                        this.cancelDart();
                    }
                });
            }).catch();
            this.blue100SphereArray.push(blue100Sphere);
        }
    }
    // --------------------------------------------------------------------------------------------
    private createRed200sphere() {
        const red200SphereCount = 12;
        for (let red200SphereIndexX = 0; red200SphereIndexX < red200SphereCount; red200SphereIndexX++) {
            const red200Sphere = Actor.CreatePrimitive(this.context, {
                definition: {
                    shape: PrimitiveShape.Sphere,
                    radius: 0.9,
                    uSegments: 8,
                    vSegments: 4
                },
                addCollider: true,
                actor: {
                    name: 'Red Sphere',
                    parentId: this.spheresRootActor.id,
                    transform: {
                        local: {
                            position: { x: 7 - (red200SphereIndexX), y: 1.6, z: 0 },
                            scale: { x: 0.3, y: 0.4, z: 0.3 },
                        }
                    },
                }
            });
            red200Sphere.created().then(() => {
                red200Sphere.collider.isTrigger = true;
                red200Sphere.collider.onTrigger('trigger-enter', (otherActor: Actor) => {
                    if (otherActor.parent.name === "throwing_dart") {
                        this.score += 200;
                        this.galleryGameScore.text.contents = `Gallery Game Score: ${this.score}`,
                            red200Sphere.destroy();
                        this.cancelDart();
                    }
                });
            }).catch();
            this.red200SphereArray.push(red200Sphere);
        }
    }

    // --------------------------------------------------------------------------------------------
    private createGreen300sphere() {
        const green300SphereCount = 12;
        for (let green300SphereIndexX = 0; green300SphereIndexX < green300SphereCount; green300SphereIndexX++) {
            const green300Sphere = Actor.CreatePrimitive(this.context, {
                definition: {
                    shape: PrimitiveShape.Sphere,
                    radius: 0.9,
                    uSegments: 8,
                    vSegments: 4
                },
                addCollider: true,
                actor: {
                    name: 'Green Sphere',
                    parentId: this.spheresRootActor.id,
                    transform: {
                        local: {
                            position: { x: 7 - (green300SphereIndexX), y: 2.4, z: 0 },
                            scale: { x: 0.3, y: 0.4, z: 0.3 },
                        }
                    },
                }
            });
            green300Sphere.created().then(() => {
                green300Sphere.collider.isTrigger = true;
                green300Sphere.collider.onTrigger('trigger-enter', (otherActor: Actor) => {
                    if (otherActor.parent.name === "throwing_dart") {
                        this.score += 300;
                        this.galleryGameScore.text.contents = `Gallery Game Score: ${this.score}`,
                            green300Sphere.destroy();
                        this.cancelDart();
                    }
                });
            }).catch();
            this.green300SphereArray.push(green300Sphere);
        }
    }

    // --------------------------------------------------------------------------------------------
    private createPurple500sphere() {
        const purple500SphereCount = 2;
        for (let purple500SphereIndexX = 0; purple500SphereIndexX < purple500SphereCount; purple500SphereIndexX++) {
            const purple500Sphere = Actor.CreatePrimitive(this.context, {
                definition: {
                    shape: PrimitiveShape.Sphere,
                    radius: 0.9,
                    uSegments: 8,
                    vSegments: 4
                },
                addCollider: true,
                actor: {
                    name: 'Purple Sphere',
                    parentId: this.spheresRootActor.id,
                    transform: {
                        local: {
                            position: { x: 7 - (purple500SphereIndexX), y: 3.2, z: 0 },
                            scale: { x: 0.3, y: 0.4, z: 0.3 },
                        }
                    },
                }
            });
            purple500Sphere.created().then(() => {
                purple500Sphere.collider.isTrigger = true;
                purple500Sphere.collider.onTrigger('trigger-enter', (purpleSphere: Actor) => {
                    if (purpleSphere.parent.name === "throwing_dart") {
                        this.score += 500;
                        this.galleryGameScore.text.contents = `Gallery Game Score: ${this.score}`,
                            purple500Sphere.destroy();
                        this.grabbedDart.destroy();
                    }
                });
            }).catch();
            this.purple500SphereArray.push(purple500Sphere);
        }
    }

    // --------------------------------------------------------------------------------------------
    private async createDesk() {
        this.desk = Actor.CreateFromPrefab(this.context, {
            prefabId: this.deskAsset[0].id,
            // Also apply the following generic actor properties.
            actor: {
                name: 'Desk',
                transform: {
                    local: {
                        position: { x: 1.8, y: -2, z: -3 },
                        scale: { x: 0.4, y: 0.4, z: 0.4 },
                        rotation: Quaternion.FromEulerAngles(0, -Math.PI, 0),
                    }
                }
            }
        });
    }

    // --------------------------------------------------------------------------------------------
    private async createDarts() {
        const dartsCount = 3;
        for (let dartsIndexX = 0; dartsIndexX < dartsCount; dartsIndexX++) {
            const dart = Actor.CreateFromPrefab(this.context, {
                prefabId: this.dartAssets[0].id,
                // Also apply the following generic actor properties.
                actor: {
                    subscriptions: ['transform'],
                    parentId: this.dartsRootActor.id,
                    name: 'Dart',
                    transform: {
                        local: {
                            position: { x: 3 - (dartsIndexX), y: -0.5, z: - 3 },
                            scale: { x: .05, y: .05, z: .05 },
                            rotation: Quaternion.FromEulerAngles(0, -Math.PI, 0),
                        }
                    },
                    grabbable: true,
                }
            });
            dart.created().then(() => {
                // tslint:disable-next-line: max-line-length
                dart.enableRigidBody({ enabled: true, detectCollisions: true, isKinematic: true });
                dart.onGrab('begin', () => {
                    this.grabTheDart();
                });
                dart.onGrab("end", () => {
                    this.throwTheDart();
                });
            }).catch();
            this.dartsArray.push(dart);
        }
    }
    // --------------------------------------------------------------------------------------------
    private grabTheDart() {
        // Align dart with user's forward direction.
        this.grabbedDart = this.dartsArray[this.dartsArray.length];
        this.dart.transform.local.rotation = this.playerOne.transform.app.rotation;
    }

    // --------------------------------------------------------------------------------------------
    private throwTheDart() {
        this.throwDart = this.grabbedDart;
        let targetPoint = new Vector3(0, 0, 10);
        targetPoint = targetPoint.rotateByQuaternionToRef(this.playerOne.transform.app.rotation, targetPoint);
        targetPoint.add(this.playerOne.transform.app.position);
        // tslint:disable-next-line: max-line-length
        this.throwDart.animateTo({ transform: { local: { position: targetPoint } } }, 3, AnimationEaseCurves.Linear);
        setTimeout(() => this.throwDart.destroy(), 4000);
    }

    // --------------------------------------------------------------------------------------------
    private cancelDart() {
        this.grabbedDart.destroy();
        // tslint:disable-next-line: no-floating-promises
    }

    // --------------------------------------------------------------------------------------------
    private createPlayButton() {
        this.gamePlayButton = Actor.CreateFromPrefab(this.context, {
            prefabId: this.gamePlayButtonAsset[0].id,
            // Also apply the following generic actor properties.
            actor: {
                name: 'Game Play Button',
                transform: {
                    local: {
                        position: { x: 2.75, y: -1.2, z: -3.25 },
                        scale: { x: 5, y: 3, z: 3 },
                        rotation: Quaternion.FromEulerAngles(0, -Math.PI, 0),
                    }
                }
            }
        });
    }

    // --------------------------------------------------------------------------------------------
    private startGame() {
        const gamePlayButtonBehavior = this.gamePlayButton.setBehavior(ButtonBehavior);
        // When Game Play Button is clicked trigger the game play action.
        gamePlayButtonBehavior.onClick(() => {
            const gamePlayButtonInitialed = setInterval(() => {
                this.timer--;
                this.galleryGameRoundTimer.text.contents = `Gallery Game Timer: ${this.timer}`;
                if (this.timer === 0) {
                    clearInterval(gamePlayButtonInitialed);
                    this.scoreAndTimerRootActor.destroy();
                    if (this.spheresRootActor != null) {
                        if (this.dartsRootActor != null) {
                            this.dartsRootActor.destroy();
                        }
                        this.spheresRootActor.destroy();
                    }
                    // tslint:disable-next-line: no-floating-promises
                    this.started();
                }
            }, 1000);
        });
    }

    // --------------------------------------------------------------------------------------------
    // TODO: Need to implement the game leave button.
    private leaveGameButton() {
        // User presses  the Leave Game Button on the table. Call this in endGame.

    }

}
