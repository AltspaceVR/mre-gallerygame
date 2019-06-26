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
    PrimitiveShape,
    Quaternion,
    RigidBody,
    TextAnchorLocation,
    Vector2,
    Vector3,
    Vector4,
} from '@microsoft/mixed-reality-extension-sdk';
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

    constructor(private context: Context, private baseUrl: string) {
        this.context.onStarted(() => this.started());
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
                    contents: "Game Gallery",
                    anchor: TextAnchorLocation.TopLeft,
                    color: { r: 30 / 255, g: 206 / 255, b: 213 / 255 },
                    height: 0.3
                }
            }
        });
        this.launchSphere();
        this.createDart();
        this.createDart();
    }
    private cancelSphere() {
        this.sphere.destroy();
        setTimeout(() => this.launchSphere(), 100);
    }
    private launchSphere() {
        for (let tileIndexX = 0; tileIndexX < 3; tileIndexX++) {
            for (let tileIndexZ = 0; tileIndexZ < 3; tileIndexZ++) {
                const rootPromise = Actor.CreateEmpty(this.context);
                this.root = rootPromise.value;
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
                                position: { x: (tileIndexX) - 1.0, y: 0.5, z: (tileIndexZ) - 1.0 },
                                scale: { x: 0.4, y: 0.4, z: 0.4 }
                            }
                        },
                    }
                });
                this.sphere = spherePromise.value;
                const buttonBehavior = this.sphere.setBehavior(ButtonBehavior);
                this.sphere.subscribe("transform");
                const timer = setTimeout(() => this.cancelSphere(), 3000);
                buttonBehavior.onClick(() => {
                    clearTimeout(timer);
                    this.cancelSphere();
                });
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
                name: 'Dart',
                // Parent the glTF model to the text actor.
                transform: {
                    local: {
                        position: { x: -1, y: -.5, z: 0 },
                        scale: { x: .05, y: .05, z: .05 },
                        rotation: Quaternion.FromEulerAngles(0, -Math.PI, 0),
                    }
                },
                grabbable: true
            }
        });
        this.dart = dartPromise.value;
        this.dart.onGrab("end", () => {
            // tslint:disable-next-line: max-line-length
            this.dart.transform.local.rotation = Quaternion.LookAt(this.dart.transform.local.position, this.sphere.transform.local.position);
            // tslint:disable-next-line: max-line-length
            this.dart.animateTo({ transform: { local: { position: this.sphere.transform.local.position } } }, 4, AnimationEaseCurves.Linear);
            // tslint:disable-next-line: max-line-length
            console.log("same position", this.dart.transform.local.position === this.sphere.transform.local.position);
        });
    }
}
