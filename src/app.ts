/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {
    Actor,
    AnimationEaseCurves,
    ButtonBehavior,
    Collider,
    CollisionDetectionMode,
    Color3,
    Context,
    ForwardPromise,
    PrimitiveShape,
    Quaternion,
    RigidBody,
    TargetBehavior,
    TextAnchorLocation,
    User,
    Vector2,
    Vector3,
    Vector4,
} from '@microsoft/mixed-reality-extension-sdk';
import { DESTRUCTION } from 'dns';
import { isPrimitive } from 'util';
/**
 * The main class of this app. All the logic goes here.
 */
export default class GameGallery {
    private root: Actor;
    private sphere: Actor;
    private dart: Actor;
    private dartPromise: Actor;
    private spherePromise: Actor;
    private textPromise: Actor;
    private playerOne: Actor;
    public score: number;

    private sphereArray: Actor[] = [];

    constructor(private context: Context, private baseUrl: string) {
        this.context.onStarted(() => this.started());
        this.context.onUserJoined((user) => this.userJoined(user));
    }

    private userJoined(user: User) {
        const playerOnePromise = Actor.CreateEmpty(this.context, {
            actor: {
                attachment: {
                    userId: user.id,
                    attachPoint: 'head',
                },
                name: "this is the head",
                subscriptions: ['transform']
            },
        });
        this.playerOne = playerOnePromise.value;
    }

    private started() {
        this.score = 0;
        this.textPromise = Actor.CreateEmpty(this.context, {
            actor: {
                name: 'Text',
                transform: {
                    app: { position: { x: 0, y: 0.5, z: 0 } }
                },
                text: {
                    contents: "Gallery Game, score: " + JSON.stringify(this.score),
                    anchor: TextAnchorLocation.TopLeft,
                    color: { r: 30 / 255, g: 206 / 255, b: 213 / 255 },
                    height: 0.3
                }
            }
        }).value;
        const testPromise = Actor.CreatePrimitive(this.context, {
            definition: {
                shape: PrimitiveShape.Box,
                dimensions: { x: 1, y: 1, z: 1 }
            },
            addCollider: true,
            actor: {
                name: 'Test',
                transform: {
                    local: {
                        position: { x: 2, y: 2, z: 2 },
                        scale: { x: 0.3, y: 0.4, z: 0.3 },
                    }
                },
                grabbable: true,
            }
        }).then((actor) => {
            actor.enableRigidBody({ detectCollisions: true, useGravity: false });
        });
        this.createRootActor();
        this.launchSphere();
        this.createDart();
        this.sphereBehavior();
        this.playerOne.subscribe('transform');
        this.dart.subscribe('transform');
    }
    private cancelSphere() {
        this.sphere.destroy();
    }
    private cancelDart() {
        this.dart.destroy();
        this.createDart();
    }
    private createRootActor() {
        const rootPromise = Actor.CreateEmpty(this.context);
        this.root = rootPromise.value;
    }
    private sphereBehavior() {
        // tslint:disable-next-line: prefer-for-of
        for (let sphere = 0; sphere < this.sphereArray.length; sphere++) {
            this.sphereArray[sphere].setBehavior(ButtonBehavior).onClick(() => {
                this.sphereArray[sphere].destroy();
            });
        }
    }
    private launchSphere() {
        for (let tileIndexY = 0; tileIndexY < 4; tileIndexY++) {
            for (let tileIndexZ = 0; tileIndexZ < 4; tileIndexZ++) {
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
                                position: { x: - 5.0, y: (tileIndexY) - 1.0, z: (tileIndexZ) - 1.0 },
                                scale: { x: 0.3, y: 0.4, z: 0.3 },
                            }
                        },
                    }
                });
                spherePromise.then(actor => {
                    actor.collider.isTrigger = true;
                    actor.collider.onTrigger('trigger-enter', (otherActor: Actor) => {
                        console.log("other actor name: " + otherActor.name);
                        if (otherActor.parent.name === "throwing_dart") {
                            this.score += 10;
                            this.textPromise.text.contents = "Gallery Game, score: " + JSON.stringify(this.score);
                            actor.destroy();
                            // this.cancelSphere();
                            this.cancelDart();
                        }
                    });
                }).catch();
                this.sphereArray.push(spherePromise.value);
            }
        }
    }
    private createDart() {
        const dartPromise = Actor.CreateFromGLTF(this.context, {
            // at the given URL
            resourceUrl: `${this.baseUrl}/11750_throwing_dart_v1_L3.glb`,
            // and spawn box colliders around the meshes.
            colliderType: 'box',
            // Also apply the following generic actor properties.
            actor: {
                parentId: this.root.id,
                name: 'Dart',
                transform: {
                    local: {
                        position: { x: -1, y: -.5, z: 0 },
                        scale: { x: .05, y: .05, z: .05 },
                        rotation: Quaternion.FromEulerAngles(0, -Math.PI, 0),
                    }
                },
                grabbable: true,
            }
        });
        this.dart = dartPromise.value;

        this.dart.enableRigidBody({ detectCollisions: true, useGravity: false, isKinematic: true });

        this.dart.onGrab('begin', () => {
            this.initGrabbedDart();
        });

        this.dart.onGrab("end", () => {
            this.throwDart();

        });

        /*
        this.dart.collider.isTrigger = true;
        this.dart.collider.onCollision('collision-enter', () => {
            this.score += 10;
            this.textPromise.text.contents = "Gallery Game, score: " + JSON.stringify(this.score);
            this.cancelDart();
            console.log("--------score", this.score);
        });
        */

    }

    private initGrabbedDart() {
        // Align dart with user's forward direction.
        this.dart.transform.app.rotation = this.playerOne.transform.app.rotation;
    }

    private throwDart() {
        let targetPoint = new Vector3(0, 0, 10);
        const angles = this.playerOne.transform.app.rotation.toEulerAngles();
        targetPoint = targetPoint.rotateByQuaternionToRef(this.playerOne.transform.app.rotation, targetPoint);
        targetPoint.add(this.playerOne.transform.app.position);
        // tslint:disable-next-line: max-line-length
        this.dart.animateTo({ transform: { local: { position: targetPoint } } }, 3, AnimationEaseCurves.Linear);
        setTimeout(() => this.cancelDart(), 9000);

        // this.dart.transform.local.position.z += this.playerOne.transform.local.position.z + -6;
        // tslint:disable-next-line: max-line-length
        // setTimeout(() => { this.dart.transform.local.position.z += this.playerOne.transform.local.position.z - 1; }, 600);
        // this.dart.collider.isTrigger = true;
    }
}
