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

    private sphereArray: Array<Actor> = [];

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
        this.createRootActor();
        this.launchSphere();
        this.createDart();
        this.createDart();
        this.sphereBehavior();
    }
    private cancelSphere() {
        this.sphere.destroy();
    }
    private createRootActor(){
        const rootPromise = Actor.CreateEmpty(this.context);
        this.root = rootPromise.value;
    }
    private sphereBehavior(){
// tslint:disable-next-line: prefer-for-of
        for(let sphere = 0; sphere < this.sphereArray.length; sphere++) {
             this.sphereArray[sphere].setBehavior(ButtonBehavior).onClick(() => {
                this.sphereArray[sphere].destroy();
            });
        //     this.sphereArray[sphere].setBehavior(ButtonBehavior).onHover('enter', ()=>{
        //         this.sphereArray[sphere].light.color.r = 140;
        // });
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
