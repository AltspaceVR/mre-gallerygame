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
import { isPrimitive } from 'util';
import { DESTRUCTION } from 'dns';
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
                    attachPoint: 'hips',
                },
                name: "this is the hip",
                subscriptions: ['transform']
            },
        });
     this.playerOne = playerOnePromise.value;
    }
    /**
     * Once the context is "started", initialize the app.
     */
    private started() {
        const textPromise = Actor.CreateEmpty(this.context, {
            actor: {
                name: 'Text',
                transform: {
                    app: { position: { x: 0, y: 0.5, z: 0 } }
                },
                text: {
                    contents: "Gallery Game",
                    anchor: TextAnchorLocation.TopLeft,
                    color: { r: 30 / 255, g: 206 / 255, b: 213 / 255 },
                    height: 0.3
                }
            }
        });
        this.createRootActor();
        this.launchSphere();
        this.createDart();
        this.sphereBehavior();
    }
    private cancelSphere() {
        this.sphere.destroy();
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
                        // collider: {
                        //     isTrigger: true
                        // }
                    }
                });
                this.sphereArray.push(spherePromise.value);
            }
        }
    }
    private createDart() {
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
                        position: { x: -1, y: -.5, z: 0 },
                        scale: { x: .05, y: .05, z: .05 },
                        rotation: Quaternion.FromEulerAngles(0, -Math.PI, 0),
                    }
                },
                grabbable: true,
            }
        });
        this.dart = dartPromise.value;
        this.dart.enableRigidBody({ detectCollisions: true, useGravity: false });
        // this.dart.collider.isTrigger = true;
        this.dart.collider.onCollision('collision-enter', ()=>{
            console.log("heeey boo")
            this.cancelSphere();
        })


        this.dart.onGrab("end", (user) => {
// tslint:disable-next-line: max-line-length

            this.dart.animateTo({ transform: { app: { position: { z: this.sphere.transform.app.position.z + 100 } } } }, 5, AnimationEaseCurves.EaseOutSine);
            this.dart.rigidBody.velocity = 0;
        });
    }
}
