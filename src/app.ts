/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {
    Actor,
    ActorTransform,
    AnimationEaseCurves,
    Asset,
    AssetContainer,
    ButtonBehavior,
    Context,
    PrimitiveShape,
    Quaternion,
    Transform,
    User,
    Vector3,
} from '@microsoft/mixed-reality-extension-sdk';
import { inflate } from 'zlib';
/**
 * The main class of this app. All the logic goes here.
 */
export default class GalleryGame {
    private playerOne: Actor;
    private spheresRootActor: Actor;
    private dartsRootActor: Actor;
    private scoreTimerLeaderboardRootActor: Actor;
    private assets: AssetContainer;
    private score: number;
    public timer: number;
    public purple500SphereTimer: number;
    public startGameTimer: number;
    private galleryGameScore: Actor;
    private galleryGameRoundTimer: Actor;
    public galleryGameLeaderboard: Actor;
    public galleryGameLeaderboardArray: any[10] = [];
    private deskAsset: Asset[] = [];
    public desk: Actor;
    private dartAssets: Asset[] = [];
    public dart: Actor;
    public currentDart: Actor;
    public dartsArray: Actor[] = [];
    private gamePlayButtonAsset: Asset[] = [];
    public gamePlayButton: Actor;
    public blue100SphereLeftBoard: Actor;
    public blue100SphereCenterBoard: Actor;
    public blue100SphereRightBoard: Actor;
    private blue100SphereArray: Actor[] = [];
    public red200SphereLeftBoard: Actor;
    public red200SphereCenterBoard: Actor;
    public red200SphereRightBoard: Actor;
    private red200SphereArray: Actor[] = [];
    public green300SphereLeftBoard: Actor;
    public green300SphereCenterBoard: Actor;
    public green300SphereRightBoard: Actor;
    private green300SphereArray: Actor[] = [];
    public purple500Sphere: Actor;
    public purple500SphereArray: Actor[] = [];
    public spherePopBoard: Actor;

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
        // await this.createDesk();
        await this.createDarts();
        this.createGalleryGameScore();
        this.createGalleryGameRoundTimer();
        this.createGalleryGameLeaderboard();
        this.createBlue100sphereLeftBoard();
        this.createBlue100sphereCenterBoard();
        this.createBlue100sphereRightBoard();
        this.createRed200sphereRightBoard();
        this.createRed200sphereCenterBoard();
        this.createRed200sphereLeftBoard();
        this.createGreen300sphereLeftBoard();
        this.createGreen300sphereCenterBoard();
        this.createGreen300sphereRightBoard();
        this.createPurple500sphere();
        this.createSpherePopBoard();
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
        this.scoreTimerLeaderboardRootActor = Actor.CreateEmpty(this.context);
    }

    // --------------------------------------------------------------------------------------------
    private createGalleryGameScore() {
        this.score = 0;
        this.galleryGameScore = Actor.CreateEmpty(this.context, {
            actor: {
                name: 'Score',
                parentId: this.scoreTimerLeaderboardRootActor.id,
                transform: {
                    local: { position: { x: 0, y: 5, z: 0 } }
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
    public createGalleryGameRoundTimer() {
        this.timer = 15;
        this.galleryGameRoundTimer = Actor.CreateEmpty(this.context, {
            actor: {
                parentId: this.scoreTimerLeaderboardRootActor.id,
                name: 'Timer',
                subscriptions: ['transform'],
                transform: {
                    local: { position: { x: -4, y: 5, z: 0 } }
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
    private createGalleryGameLeaderboard() {
        this.galleryGameLeaderboard = Actor.CreateEmpty(this.context, {
            actor: {
                parentId: this.scoreTimerLeaderboardRootActor.id,
                name: 'Leaderboard',
                transform: {
                    local: { position: { x: -3, y: 6, z: 0 } }
                },
                text: {
                    contents: `Gallery Game Leaderboard: ${this.galleryGameLeaderboardArray}`,
                    color: { r: 30 / 255, g: 206 / 255, b: 213 / 255 },
                    height: 0.29,
                },
            }
        });
    }

    // --------------------------------------------------------------------------------------------
    private createSpherePopBoard() {
        this.spherePopBoard = Actor.CreateFromGltf(this.context, {
            resourceUrl: `${this.baseUrl}/BalloonPopBoard.glb`,
            actor: {
                parentId: this.spheresRootActor.id,
                name: 'Sphere Pop Board',
                transform: {
                    local: {
                        position: { x: -0.9, y: -2, z: -4.5 },
                        scale: { x: 3, y: 3, z: 3 },
                    }
                },
            },
        });
    }

    // --------------------------------------------------------------------------------------------
    private createBlue100sphereLeftBoard() {
        const blue100SphereCount = 4;
        for (let blue100SphereIndexX = 0; blue100SphereIndexX < blue100SphereCount; blue100SphereIndexX++) {
            const blue100SphereLeftBoard = Actor.CreatePrimitive(this.context, {
                definition: {
                    shape: PrimitiveShape.Sphere,
                    radius: 0.9,
                    uSegments: 8,
                    vSegments: 4
                },
                addCollider: true,
                actor: {
                    parentId: this.spheresRootActor.id,
                    name: 'Blue Sphere',
                    transform: {
                        local: {
                            position: { x: -6 - (blue100SphereIndexX), y: 2, z: 0 },
                            scale: { x: 0.1, y: 0.1, z: 0.1 },
                            rotation: Quaternion.FromEulerAngles(0, Math.PI, 0),

                        }
                    },
                }
            });
            blue100SphereLeftBoard.created().then(() => {
                blue100SphereLeftBoard.animateTo({ transform: { local: { scale: { x: 0.3, y: 0.3, z: 0.3 } } } }, 5, AnimationEaseCurves.EaseInOutSine);
                blue100SphereLeftBoard.collider.isTrigger = true;
                blue100SphereLeftBoard.collider.onTrigger('trigger-enter', (otherActor: Actor) => {
                    if (otherActor.parent.name === "throwing_dart") {
                        this.score += 100;
                        this.galleryGameScore.text.contents = `Gallery Game Score: ${this.score}`,
                            blue100SphereLeftBoard.destroy();
                        this.dart.destroy();
                    }
                });
            }).catch();
            this.blue100SphereArray.push(this.blue100SphereLeftBoard);
        }
    }

    // --------------------------------------------------------------------------------------------
    private createBlue100sphereCenterBoard() {
        const blue100SphereCount = 4;
        for (let blue100SphereIndexX = 0; blue100SphereIndexX < blue100SphereCount; blue100SphereIndexX++) {
            const blue100SphereCenterBoard = Actor.CreatePrimitive(this.context, {
                definition: {
                    shape: PrimitiveShape.Sphere,
                    radius: 0.9,
                    uSegments: 8,
                    vSegments: 4
                },
                addCollider: true,
                actor: {
                    parentId: this.spheresRootActor.id,
                    name: 'Blue Sphere',
                    transform: {
                        local: {
                            position: { x: 1 - (blue100SphereIndexX), y: 2, z: 0 },
                            scale: { x: 0.1, y: 0.1, z: 0.1 },
                        }
                    },
                }
            });
            blue100SphereCenterBoard.created().then(() => {
                blue100SphereCenterBoard.animateTo({ transform: { local: { scale: { x: 0.3, y: 0.3, z: 0.3 } } } }, 5, AnimationEaseCurves.EaseInOutSine);
                blue100SphereCenterBoard.collider.isTrigger = true;
                blue100SphereCenterBoard.collider.onTrigger('trigger-enter', (otherActor: Actor) => {
                    if (otherActor.parent.name === "throwing_dart") {
                        this.score += 100;
                        this.galleryGameScore.text.contents = `Gallery Game Score: ${this.score}`,
                            blue100SphereCenterBoard.destroy();
                        this.dart.destroy();
                    }
                });
            }).catch();
            this.blue100SphereArray.push(this.blue100SphereCenterBoard);
        }
    }

    // --------------------------------------------------------------------------------------------
    private createBlue100sphereRightBoard() {
        const blue100SphereCount = 4;
        for (let blue100SphereIndexX = 0; blue100SphereIndexX < blue100SphereCount; blue100SphereIndexX++) {
            const blue100SphereRightBoard = Actor.CreatePrimitive(this.context, {
                definition: {
                    shape: PrimitiveShape.Sphere,
                    radius: 0.9,
                    uSegments: 8,
                    vSegments: 4
                },
                addCollider: true,
                actor: {
                    parentId: this.spheresRootActor.id,
                    name: 'Blue Sphere',
                    transform: {
                        local: {
                            position: { x: 8 - (blue100SphereIndexX), y: 2, z: 0 },
                            scale: { x: 0.1, y: 0.1, z: 0.1 },
                            rotation: Quaternion.FromEulerAngles(0, -Math.PI, 0),

                        }
                    },
                }
            });
            blue100SphereRightBoard.created().then(() => {
                blue100SphereRightBoard.animateTo({ transform: { local: { scale: { x: 0.3, y: 0.3, z: 0.3 } } } }, 5, AnimationEaseCurves.EaseInOutSine);
                blue100SphereRightBoard.collider.isTrigger = true;
                blue100SphereRightBoard.collider.onTrigger('trigger-enter', (otherActor: Actor) => {
                    if (otherActor.parent.name === "throwing_dart") {
                        this.score += 100;
                        this.galleryGameScore.text.contents = `Gallery Game Score: ${this.score}`,
                            blue100SphereRightBoard.destroy();
                        this.dart.destroy();
                    }
                });
            }).catch();
            this.blue100SphereArray.push(this.blue100SphereRightBoard);
        }
    }

    // --------------------------------------------------------------------------------------------
    private createRed200sphereLeftBoard() {
        const red200SphereCount = 4;
        for (let red200SphereIndexX = 0; red200SphereIndexX < red200SphereCount; red200SphereIndexX++) {
            const red200SphereLeftBoard = Actor.CreatePrimitive(this.context, {
                definition: {
                    shape: PrimitiveShape.Sphere,
                    radius: 0.9,
                    uSegments: 8,
                    vSegments: 4
                },
                addCollider: true,
                actor: {
                    parentId: this.spheresRootActor.id,
                    name: 'Red Sphere',
                    transform: {
                        local: {
                            position: { x: -6 - (red200SphereIndexX), y: 3, z: 0 },
                            scale: { x: 0.1, y: 0.1, z: 0.1 },
                            rotation: Quaternion.FromEulerAngles(0, -Math.PI, 0),

                        }
                    },
                }
            });
            red200SphereLeftBoard.created().then(() => {
                red200SphereLeftBoard.animateTo({ transform: { local: { scale: { x: 0.3, y: 0.3, z: 0.3 } } } }, 5, AnimationEaseCurves.EaseInOutSine);
                red200SphereLeftBoard.collider.isTrigger = true;
                red200SphereLeftBoard.collider.onTrigger('trigger-enter', (otherActor: Actor) => {
                    if (otherActor.parent.name === "throwing_dart") {
                        this.score += 200;
                        this.galleryGameScore.text.contents = `Gallery Game Score: ${this.score}`,
                            red200SphereLeftBoard.destroy();
                        this.dart.destroy();
                    }
                });
            }).catch();
            this.red200SphereArray.push(red200SphereLeftBoard);
        }
    }

    // --------------------------------------------------------------------------------------------
    private createRed200sphereCenterBoard() {
        const red200SphereCount = 4;
        for (let red200SphereIndexX = 0; red200SphereIndexX < red200SphereCount; red200SphereIndexX++) {
            const red200SphereCenterBoard = Actor.CreatePrimitive(this.context, {
                definition: {
                    shape: PrimitiveShape.Sphere,
                    radius: 0.9,
                    uSegments: 8,
                    vSegments: 4
                },
                addCollider: true,
                actor: {
                    parentId: this.spheresRootActor.id,
                    name: 'Red Sphere',
                    transform: {
                        local: {
                            position: { x: 1 - (red200SphereIndexX), y: 3, z: 0 },
                            scale: { x: 0.1, y: 0.1, z: 0.1 },
                        }
                    },
                }
            });
            red200SphereCenterBoard.created().then(() => {
                red200SphereCenterBoard.animateTo({ transform: { local: { scale: { x: 0.3, y: 0.3, z: 0.3 } } } }, 5, AnimationEaseCurves.EaseInOutSine);
                red200SphereCenterBoard.collider.isTrigger = true;
                red200SphereCenterBoard.collider.onTrigger('trigger-enter', (otherActor: Actor) => {
                    if (otherActor.parent.name === "throwing_dart") {
                        this.score += 200;
                        this.galleryGameScore.text.contents = `Gallery Game Score: ${this.score}`,
                            red200SphereCenterBoard.destroy();
                        this.dart.destroy();
                    }
                });
            }).catch();
            this.red200SphereArray.push(red200SphereCenterBoard);
        }
    }

    // --------------------------------------------------------------------------------------------
    private createRed200sphereRightBoard() {
        const red200SphereCount = 4;
        for (let red200SphereIndexX = 0; red200SphereIndexX < red200SphereCount; red200SphereIndexX++) {
            const createRed200sphereRightBoard = Actor.CreatePrimitive(this.context, {
                definition: {
                    shape: PrimitiveShape.Sphere,
                    radius: 0.9,
                    uSegments: 8,
                    vSegments: 4
                },
                addCollider: true,
                actor: {
                    parentId: this.spheresRootActor.id,
                    name: 'Red Sphere',
                    transform: {
                        local: {
                            position: { x: 8 - (red200SphereIndexX), y: 3, z: 0 },
                            scale: { x: 0.1, y: 0.1, z: 0.1 },
                            rotation: Quaternion.FromEulerAngles(0, -Math.PI, 0),

                        }
                    },
                }
            });
            createRed200sphereRightBoard.created().then(() => {
                createRed200sphereRightBoard.animateTo({ transform: { local: { scale: { x: 0.3, y: 0.3, z: 0.3 } } } }, 5, AnimationEaseCurves.EaseInOutSine);
                createRed200sphereRightBoard.collider.isTrigger = true;
                createRed200sphereRightBoard.collider.onTrigger('trigger-enter', (otherActor: Actor) => {
                    if (otherActor.parent.name === "throwing_dart") {
                        this.score += 200;
                        this.galleryGameScore.text.contents = `Gallery Game Score: ${this.score}`,
                            createRed200sphereRightBoard.destroy();
                        this.dart.destroy();
                    }
                });
            }).catch();
            this.red200SphereArray.push(createRed200sphereRightBoard);
        }
    }

    // --------------------------------------------------------------------------------------------
    private createGreen300sphereLeftBoard() {
        const green300SphereCount = 4;
        for (let green300SphereIndexX = 0; green300SphereIndexX < green300SphereCount; green300SphereIndexX++) {
            const green300sphereLeftBoard = Actor.CreatePrimitive(this.context, {
                definition: {
                    shape: PrimitiveShape.Sphere,
                    radius: 0.9,
                    uSegments: 8,
                    vSegments: 4
                },
                addCollider: true,
                actor: {
                    parentId: this.spheresRootActor.id,
                    name: 'Green Sphere',
                    transform: {
                        local: {
                            position: { x: -6 - (green300SphereIndexX), y: 4, z: 0 },
                            scale: { x: 0.1, y: 0.1, z: 0.1 },
                            rotation: Quaternion.FromEulerAngles(0, -Math.PI, 0),

                        }
                    },
                }
            });
            green300sphereLeftBoard.created().then(() => {
                green300sphereLeftBoard.animateTo({ transform: { local: { scale: { x: 0.3, y: 0.3, z: 0.3 } } } }, 5, AnimationEaseCurves.EaseInOutSine);
                green300sphereLeftBoard.collider.isTrigger = true;
                green300sphereLeftBoard.collider.onTrigger('trigger-enter', (otherActor: Actor) => {
                    if (otherActor.parent.name === "throwing_dart") {
                        this.score += 300;
                        this.galleryGameScore.text.contents = `Gallery Game Score: ${this.score}`,
                            green300sphereLeftBoard.destroy();
                        this.dart.destroy();
                    }
                });
            }).catch();
            this.green300SphereArray.push(green300sphereLeftBoard);
        }
    }

    // --------------------------------------------------------------------------------------------
    private createGreen300sphereCenterBoard() {
        const green300SphereCount = 4;
        for (let green300SphereIndexX = 0; green300SphereIndexX < green300SphereCount; green300SphereIndexX++) {
            const green300SphereCenterBoard = Actor.CreatePrimitive(this.context, {
                definition: {
                    shape: PrimitiveShape.Sphere,
                    radius: 0.9,
                    uSegments: 8,
                    vSegments: 4
                },
                addCollider: true,
                actor: {
                    parentId: this.spheresRootActor.id,
                    name: 'Green Sphere',
                    transform: {
                        local: {
                            position: { x: 1 - (green300SphereIndexX), y: 4, z: 0 },
                            scale: { x: 0.1, y: 0.1, z: 0.1 },
                        }
                    },
                }
            });
            green300SphereCenterBoard.created().then(() => {
                green300SphereCenterBoard.animateTo({ transform: { local: { scale: { x: 0.3, y: 0.3, z: 0.3 } } } }, 5, AnimationEaseCurves.EaseInOutSine);
                green300SphereCenterBoard.collider.isTrigger = true;
                green300SphereCenterBoard.collider.onTrigger('trigger-enter', (otherActor: Actor) => {
                    if (otherActor.parent.name === "throwing_dart") {
                        this.score += 300;
                        this.galleryGameScore.text.contents = `Gallery Game Score: ${this.score}`,
                            green300SphereCenterBoard.destroy();
                        this.dart.destroy();
                    }
                });
            }).catch();
            this.green300SphereArray.push(green300SphereCenterBoard);
        }
    }

    // --------------------------------------------------------------------------------------------
    private createGreen300sphereRightBoard() {
        const green300SphereCount = 4;
        for (let green300SphereIndexX = 0; green300SphereIndexX < green300SphereCount; green300SphereIndexX++) {
            const green300SphereRightBoard = Actor.CreatePrimitive(this.context, {
                definition: {
                    shape: PrimitiveShape.Sphere,
                    radius: 0.9,
                    uSegments: 8,
                    vSegments: 4
                },
                addCollider: true,
                actor: {
                    parentId: this.spheresRootActor.id,
                    name: 'Green Sphere',
                    transform: {
                        local: {
                            position: { x: 8 - (green300SphereIndexX), y: 4, z: 0 },
                            scale: { x: 0.1, y: 0.1, z: 0.1 },
                            rotation: Quaternion.FromEulerAngles(0, -Math.PI, 0),

                        }
                    },
                }
            });
            green300SphereRightBoard.created().then(() => {
                green300SphereRightBoard.animateTo({ transform: { local: { scale: { x: 0.3, y: 0.3, z: 0.3 } } } }, 5, AnimationEaseCurves.EaseInOutSine);
                green300SphereRightBoard.collider.isTrigger = true;
                green300SphereRightBoard.collider.onTrigger('trigger-enter', (otherActor: Actor) => {
                    if (otherActor.parent.name === "throwing_dart") {
                        this.score += 300;
                        this.galleryGameScore.text.contents = `Gallery Game Score: ${this.score}`,
                            green300SphereRightBoard.destroy();
                        this.dart.destroy();
                    }
                });
            }).catch();
            this.green300SphereArray.push(green300SphereRightBoard);
        }
    }

    // --------------------------------------------------------------------------------------------
    public createPurple500sphere() {
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
                    parentId: this.spheresRootActor.id,
                    name: 'Purple Sphere',
                    subscriptions: ['transform'],
                    transform: {
                        local: {
                            position: { x: 7 - (purple500SphereIndexX), y: 5, z: 0 },
                            scale: { x: 0.1, y: 0.1, z: 0.1 },
                        }
                    },
                }
            });
            purple500Sphere.created().then(() => {

                // if (this.timer / 3) {
                //     console.log("this is working...", this.timer);
                //     this.purple500Sphere.animateTo({ transform: { local: { scale: { x: 0.1, y: 0.1, z: 0.1 } } } }, 9, AnimationEaseCurves.EaseInOutSine);
                // } else {
                //     this.purple500Sphere.animateTo({ transform: { local: { scale: { x: 0.3, y: 0.3, z: 0.3 } } } }, 1, AnimationEaseCurves.EaseInOutSine);
                // }
                // purple500Sphere.animateTo({ transform: { local: { scale: { x: 0.3, y: 0.3, z: 0.3 } } } }, 9, AnimationEaseCurves.EaseInOutSine);
                purple500Sphere.collider.isTrigger = true;
                purple500Sphere.collider.onTrigger('trigger-enter', (otherActor: Actor) => {
                    if (otherActor.parent.name === "throwing_dart") {
                        this.score += 500;
                        this.galleryGameScore.text.contents = `Gallery Game Score: ${this.score}`,
                            purple500Sphere.destroy();
                        this.dart.destroy();
                    }
                });
                // const purple500SphereBehavior = this.gamePlayButton.setBehavior(ButtonBehavior);
                // purple500SphereBehavior.onClick(() => {
                const purple500SphereBehaviorInterval = setInterval(() => {
                    this.purple500SphereTimer--;
                    if (this.purple500SphereTimer / 3) {
                        console.log('this is working', this.purple500SphereTimer);
                        purple500Sphere.animateTo({ transform: { local: { scale: { x: 0.3, y: 0.3, z: 0.3 } } } }, 1, AnimationEaseCurves.EaseInOutSine);
                    } else {
                        purple500Sphere.animateTo({ transform: { local: { scale: { x: 0.1, y: 0.1, z: 0.1 } } } }, 1, AnimationEaseCurves.EaseInOutSine);
                    }
                    if (this.purple500SphereTimer === 0) {
                        clearInterval(purple500SphereBehaviorInterval);
                    }
                }, 1000);
                // });
            }).catch();
            this.purple500SphereArray.push(this.purple500Sphere);
        }
    }

    // --------------------------------------------------------------------------------------------
    // private allSpheresRandomlyInflateDeflate(array: any) {
    //     Math.floor(Math.random() * (array + 1) + array);
    // }

    // --------------------------------------------------------------------------------------------
    // private async createDesk() {
    //     this.desk = Actor.CreateFromPrefab(this.context, {
    //         prefabId: this.deskAsset[0].id,
    //         // Also apply the following generic actor properties.
    //         actor: {
    //             name: 'Desk',
    //             transform: {
    //                 local: {
    //                     position: { x: 1.8, y: -2, z: -3 },
    //                     scale: { x: 0.4, y: 0.4, z: 0.4 },
    //                     rotation: Quaternion.FromEulerAngles(0, -Math.PI, 0),
    //                 }
    //             }
    //         }
    //     });
    // }

    // --------------------------------------------------------------------------------------------
    private async createDarts() {
        const dartsCount = 3;
        for (let dartsIndexX = 0; dartsIndexX < dartsCount; dartsIndexX++) {
            this.dart = Actor.CreateFromPrefab(this.context, {
                prefabId: this.dartAssets[0].id,
                // Also apply the following generic actor properties.
                actor: {
                    parentId: this.dartsRootActor.id,
                    name: 'Dart',
                    subscriptions: ['transform'],
                    transform: {
                        local: {
                            position: { x: 0 - (dartsIndexX), y: 1.5, z: - 3 },
                            scale: { x: .05, y: .05, z: .05 },
                            rotation: Quaternion.FromEulerAngles(0, -Math.PI, 0),
                        }
                    },
                    rigidBody: {
                        enabled: true,
                        detectCollisions: true,
                        isKinematic: true,
                    },
                    grabbable: true,
                }
            });
            this.dart.created().then(() => {
                this.dart.onGrab('begin', () => {
                    this.grabTheDart();
                });
                this.dart.onGrab("end", () => {
                    this.throwTheDart();
                });
            }).catch();
            this.dartsArray.push(this.dart);
        }
    }

    // --------------------------------------------------------------------------------------------
    public grabTheDart() {
        // Align dart with user's forward direction.
        this.dart.transform.local.rotation = this.playerOne.transform.app.rotation;
    }

    // --------------------------------------------------------------------------------------------
    private throwTheDart() {
        let targetPoint = new Vector3(0, 0, 10);
        targetPoint = targetPoint.rotateByQuaternionToRef(this.playerOne.transform.app.rotation, targetPoint);
        targetPoint = targetPoint.add(this.playerOne.transform.app.position);
        // tslint:disable-next-line: max-line-length
        this.dart.animateTo({ transform: { local: { position: targetPoint } } }, 3, AnimationEaseCurves.Linear);
        setTimeout(async () => {
            this.cancelDart();
            await this.createDarts();
        }, 4000);
    }

    // --------------------------------------------------------------------------------------------
    private cancelDart() {
        this.dart.destroy();
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
                        position: { x: 1, y: 0.5, z: -3.25 },
                        scale: { x: 5, y: 3, z: 3 },
                        rotation: Quaternion.FromEulerAngles(0, -Math.PI, 0),
                    }
                }
            }
        });
    }

    // --------------------------------------------------------------------------------------------
    public startGame() {
        this.startGameTimer = this.timer;
        const gamePlayButtonBehavior = this.gamePlayButton.setBehavior(ButtonBehavior);
        // When Game Play Button is clicked trigger the game play action.
        gamePlayButtonBehavior.onClick(() => {
            const gamePlayButtonInitialed = setInterval(() => {
                this.startGameTimer--;
                console.log("this working", this.startGameTimer);
                this.galleryGameRoundTimer.text.contents = `Gallery Game Timer: ${this.startGameTimer}`;
                // if (this.timer / 6) {
                //     this.purple500Sphere.animateTo({ transform: { local: { scale: { x: 0.1, y: 0.1, z: 0.1 } } } }, 1, AnimationEaseCurves.EaseInOutSine);
                // }
                // if (this.timer / 3) {
                //     this.purple500SphereArray[this.purple500SphereArray.length].animateTo({ transform: { local: { scale: { x: 0.3, y: 0.3, z: 0.3 } } } }, 9, AnimationEaseCurves.EaseInOutSine);
                // } else {
                //     this.purple500SphereArray[this.purple500SphereArray.length].animateTo({ transform: { local: { scale: { x: 0.1, y: 0.1, z: 0.1 } } } }, 1, AnimationEaseCurves.EaseInOutSine);
                // }
                if (this.startGameTimer === 0) {
                    clearInterval(gamePlayButtonInitialed);
                    this.galleryGameLeaderboardArray.push(this.score + " " + this.userJoined.name);
                    this.galleryGameLeaderboardArray.sort();
                    this.galleryGameLeaderboardArray.reverse();
                    this.scoreTimerLeaderboardRootActor.destroy();
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
    // private leaveGameButton() {
    //     // User presses  the Leave Game Button on the table. Call this in endGame.

    // }
}
