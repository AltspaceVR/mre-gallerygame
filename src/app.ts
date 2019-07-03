/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {
    Actor,
    AnimationEaseCurves,
    ButtonBehavior,
    Context,
    PrimitiveShape,
    Quaternion,
    TextAnchorLocation,
    User,
} from '@microsoft/mixed-reality-extension-sdk';
/**
 * The main class of this app. All the logic goes here.
 */
export default class GameGallery {
    private root: Actor;
    private sphere: Actor;
    private dart: Actor;
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
    }
    /**
     * Once the context is "started", initialize the app.
     */
    private started() {
        this.createRootActor();
        this.launchSphere();
        this.createDart();
        this.sphereBehavior();
        this.dart.collider.onTrigger('trigger-exit', () => {
            console.log("do something");
            this.cancelSphere();
        });
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
                    }
                });
                spherePromise.then(actor => {
                    actor.collider.isTrigger = true;
                    actor.collider.onTrigger('trigger-enter', (otherActor: Actor) => {
                        console.log("other actor name: " + otherActor.name);
                        if (otherActor.parent.name === "throwing_dart") {
                            actor.destroy();
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
            colliderType: 'sphere',
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
                rigidBody: {
                    isKinematic: true,
                },
                grabbable: true
            }
        });
        this.dart = dartPromise.value;
        this.dart.enableRigidBody({ detectCollisions: true, useGravity: false });
        this.dart.collider.onCollision('collision-enter', () => {
            console.log('heeeyyyyy')
        })
        // this.dart.collider.isTrigger = true;
        this.dart.onGrab("end", () => {
            // tslint:disable-next-line: max-line-length
            this.dart.animateTo({ transform: { app: { position: { z: this.sphere.transform.app.position.z + 100 } } } }, 5, AnimationEaseCurves.EaseOutSine);
            this.dart.rigidBody.velocity = 0;
        });
    }
}
