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
    Collider,
    Context,
    PrimitiveShape,
    Quaternion,
    User,
    Vector3,
} from '@microsoft/mixed-reality-extension-sdk';
import { ok } from 'assert';
/**
 * The main class of this app. All the logic goes here.
 */
export default class GalleryGame {
    private root: Actor;
    private playerOne: Actor;
    private gameScore: Actor;
    private gameTimer: Actor;
    private sphereArray: Actor[] = [];
    private spheres: Actor;
    private desk: Actor;
    private dart: Actor;
    private gamePlayButton: Actor;
    public score: number;
    public timer: number;
    public assets: AssetContainer;
    public dartAssets: Asset[];

    constructor(private context: Context, private baseUrl: string) {
        this.context.onStarted(async () => await this.started());
        this.context.onUserJoined(user => this.userJoined(user));
        this.assets = new AssetContainer(context);
    }

    // ----------------------------------------------------------------------
    private userJoined(user: User) {
        const playerOne = Actor.CreateEmpty(this.context, {
            actor: {
                attachment: {
                    userId: user.id,
                    attachPoint: 'right-hand',
                },
                name: "PlayerOne Right Hand",
            },
        });
        this.playerOne = playerOne;
        this.playerOne.subscribe('transform');
    }

    private async started() {
        await this.preloadAssets();
        this.createRootActor();
        this.createGalleryGameScore();
        this.createGalleryGameTimer();
        this.createSpheres();
        this.createDesk();
        this.createDart();
        this.createPlayButton();
        this.startGame();
    }

    private async preloadAssets() {
        // tslint:disable: max-line-length
        return Promise.all([
            this.assets.loadGltf(`${this.baseUrl}/11750_throwing_dart_v1_L3.glb`, 'mesh').then(assets => this.dartAssets = assets),
        ]);
        // tslint:disable: max-line-length
    }

    private createRootActor() {
        const root = Actor.CreateEmpty(this.context);
        this.root = root;
    }

    private createGalleryGameScore() {
        this.score = 0;
        const galleryGameScore = Actor.CreateEmpty(this.context, {
            actor: {
                name: 'Score',
                parentId: this.root.id,
                transform: {
                    local: { position: { x: 0, y: 4, z: 0 } }
                },
                text: {
                    contents: "Gallery Game Score: " + JSON.stringify(this.score),
                    color: { r: 30 / 255, g: 206 / 255, b: 213 / 255 },
                    height: 0.29,
                },
            }
        });
        this.gameScore = galleryGameScore;
    }

    private createGalleryGameTimer() {
        this.timer = 45;
        const galleryGameTimer = Actor.CreateEmpty(this.context, {
            actor: {
                name: 'Timer',
                parentId: this.root.id,
                transform: {
                    local: { position: { x: 4, y: 4, z: 0 } }
                },
                text: {
                    contents: "Gallery Game Timer: " + JSON.stringify(this.timer),
                    color: { r: 30 / 255, g: 206 / 255, b: 213 / 255 },
                    height: 0.29,
                },
            }
        });
        this.gameTimer = galleryGameTimer;
    }

    private createSpheres() {
        for (let tileIndexY = 0; tileIndexY < 4; tileIndexY++) {
            for (let tileIndexX = 0; tileIndexX < 4; tileIndexX++) {
                const spheres = Actor.CreatePrimitive(this.context, {
                    definition: {
                        shape: PrimitiveShape.Sphere,
                        radius: 0.9,
                        uSegments: 8,
                        vSegments: 4
                    },
                    addCollider: true,
                    actor: {
                        name: 'Sphere',
                        parentId: this.root.id,
                        transform: {
                            local: {
                                position: { x: (tileIndexX), y: (tileIndexY), z: 0 },
                                scale: { x: 0.3, y: 0.4, z: 0.3 },
                            }
                        },
                    }
                });
                spheres.created().then(() => {
                    spheres.collider.isTrigger = true;
                    spheres.collider.onTrigger('trigger-enter', (otherActor: Actor) => {

                        if (otherActor.parent.name === "throwing_dart") {
                            this.score += 10;
                            this.gameScore.text.contents = "Gallery Game Score: " + JSON.stringify(this.score);
                            spheres.destroy();
                            this.cancelDart();
                        }
                    });
                }).catch();
                this.sphereArray.push(spheres);
            }
        }
    }

    private createDesk() {
        this.desk = Actor.CreateFromGLTF(this.context, {
            // at the given URL
            resourceUrl: `${this.baseUrl}/table.glb`,
            // and spawn box colliders around the meshes.
            colliderType: 'box',
            // Also apply the following generic actor properties.
            actor: {
                name: 'Desk',
                // Parent the glTF model to the text actor.
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

    private createDart() {
        this.dart = Actor.CreateFromPrefab(this.context, {
            prefabId: this.dartAssets[0].id,
            // Also apply the following generic actor properties.
            actor: {
                parentId: this.root.id,
                name: 'Dart',
                transform: {
                    local: {
                        position: { x: 1, y: -0.5, z: - 3 },
                        scale: { x: .05, y: .05, z: .05 },
                        rotation: Quaternion.FromEulerAngles(0, -Math.PI, 0),
                    }
                },
                grabbable: true,
            }
        });
        // tslint:disable-next-line: max-line-length
        this.dart.enableRigidBody({ enabled: true, detectCollisions: true, isKinematic: true });
        this.dart.onGrab('begin', () => {
            this.initGrabbedDart();
        });
        this.dart.onGrab("end", () => {
            this.throwDart();
        });
        this.dart.subscribe('transform');
    }

    private initGrabbedDart() {
        // Align dart with user's forward direction.
        this.dart.transform.local.rotation = this.playerOne.transform.app.rotation;
    }

    private throwDart() {
        let targetPoint = new Vector3(0, 0, 10);
        targetPoint = targetPoint.rotateByQuaternionToRef(this.playerOne.transform.app.rotation, targetPoint);
        targetPoint.add(this.playerOne.transform.app.position);
        // tslint:disable-next-line: max-line-length
        this.dart.animateTo({ transform: { local: { position: targetPoint } } }, 3, AnimationEaseCurves.Linear);
        setTimeout(() => this.cancelDart(), 6000);
    }

    private cancelDart() {
        this.dart.destroy();
        this.createDart();
    }

    private createPlayButton() {
        // Load a glTF model
        this.gamePlayButton = Actor.CreateFromGltf(this.context, {
            // at the given URL
            resourceUrl: `${this.baseUrl}/Play Button.glb`,
            // and spawn box colliders around the meshes.
            colliderType: 'box',
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

    private startGame() {
        const gamePlayButtonBehavior = this.gamePlayButton.setBehavior(ButtonBehavior);
        // When Game Play Button is clicked trigger the game play action.
        gamePlayButtonBehavior.onClick(() => {
            const timer = setInterval(async () => {
                console.log("interval called.");
                if (this.root != null) {
                    if (this.dart != null) {
                        this.dart.destroy();
                    }
                    this.root.destroy();
                }
                await this.started();
            }, 45000);
        });
    }
}
