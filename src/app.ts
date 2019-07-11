/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {
    Actor,
    AnimationEaseCurves,
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
    private root: Actor;
    private sphereArray: Actor[] = [];
    private dart: Actor;
    private text: Actor;
    private playerOne: Actor;
    public score: number;

    constructor(private context: Context, private baseUrl: string) {
        this.context.onStarted(() => this.started());
        this.context.onUserJoined((user) => this.userJoined(user));
    }
    private userJoined(user: User) {
        const playerOnePromise = Actor.CreateEmpty(this.context, {
            actor: {
                attachment: {
                    userId: user.id,
                    attachPoint: 'right-hand',
                },
                name: "PlayerOne Right Hand",
                subscriptions: ['transform']
            },
        });
        this.playerOne = playerOnePromise.value;
    }
    private started() {
        this.createRootActor();
        this.galleryGameScore();
        this.launchSphere();
        // setInterval(() => {
        //     this.cancelSphere();
        //     console.log("timer working.........");
        // }, 9000);

        // setInterval(() => {
        //     console.log("heeeyy");
        //     if (this.root.children.length === 0) {
        //         this.restartGame();
        //     }
        // }, 5000 );
        this.launchDart();
        this.playerOne.subscribe('transform');
        this.dart.subscribe('transform');
    }
    private createRootActor() {
        const rootPromise = Actor.CreateEmpty(this.context);
        this.root = rootPromise.value;
    }
    private galleryGameScore() {
        this.score = 0;
        const textPromise = Actor.CreateEmpty(this.context, {
            actor: {
                name: 'Text',
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
        this.text = textPromise.value;
    }
    private launchSphere() {
        for (let tileIndexY = 0; tileIndexY < 4; tileIndexY++) {
            for (let tileIndexX = 0; tileIndexX < 4; tileIndexX++) {
                const spherePromise = Actor.CreatePrimitive(this.context, {
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
                spherePromise.then(actor => {
                    actor.collider.isTrigger = true;
                    actor.collider.onTrigger('trigger-enter', (otherActor: Actor) => {
                        if (otherActor.parent.name === "throwing_dart") {
                            setTimeout(() => this.endGame(), 15000);
                            this.score += 10;
                            this.text.text.contents = "Gallery Game Score: " + JSON.stringify(this.score);
                            actor.destroy();
                            this.cancelDart();
                        }
                    });
                }).catch();
                this.sphereArray.push(spherePromise.value);
            }
        }
    }
    private launchDart() {
        const dartPromise = Actor.CreateFromGLTF(this.context, {
            // at the given URL
            resourceUrl: `${this.baseUrl}/11750_throwing_dart_v1_L3.glb`,
            // and spawn box colliders around the meshes.
            colliderType: 'mesh',
            // Also apply the following generic actor properties.
            actor: {
                parentId: this.root.id,
                name: 'Dart',
                transform: {
                    local: {
                        position: { x: 1.5, y: 0.5, z: - 3 },
                        scale: { x: .05, y: .05, z: .05 },
                        rotation: Quaternion.FromEulerAngles(0, -Math.PI, 0),
                    }
                },
                grabbable: true,
            }
        });
        this.dart = dartPromise.value;
        this.dart.enableRigidBody({ useGravity: false, isKinematic: true });
        this.dart.onGrab('begin', () => {
            this.initGrabbedDart();
        });
        this.dart.onGrab("end", () => {
            this.throwDart();
        });
    }
    private initGrabbedDart() {
        // Align dart with user's forward direction.
        this.dart.transform.app.rotation = this.playerOne.transform.app.rotation;
    }
    private throwDart() {
        let targetPoint = new Vector3(0, 0, 10);
        targetPoint = targetPoint.rotateByQuaternionToRef(this.playerOne.transform.app.rotation, targetPoint);
        targetPoint = targetPoint.add(this.playerOne.transform.app.position);
        // tslint:disable-next-line: max-line-length
        this.dart.animateTo({ transform: { local: { position: targetPoint } } }, 3, AnimationEaseCurves.Linear);
        setTimeout(() => this.cancelDart(), 5000);
    }
    private cancelDart() {
        this.dart.destroy();
        this.launchDart();
    }
    private endGame() {
        this.root.destroy();
        this.startGame();
    }
    private startGame() {
        this.started();
    }
}
