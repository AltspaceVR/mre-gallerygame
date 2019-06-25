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
    private sphere1: Actor;
    private sphere2: Actor;
    private sphere3: Actor;
    private sphere4: Actor;
    private sphere5: Actor;
    private sphere6: Actor;
    private sphere7: Actor;
    private sphere8: Actor;
    private sphere9: Actor;
    private desk: Actor;
    private dart: Actor;
    private dart1: Actor;
    private dart2: Actor;
    private dartPromise: Actor;
    private spherePromise: Actor;

    constructor(private context: Context, private baseUrl: string) {
        this.context.onStarted(() => this.started());
    }
    /**
     * Once the context is "started", initialize the app.
     */
    private started() {
        this.launchSphere();
        // this.launchSphere1();
        // this.launchSphere2();
        // this.launchSphere3();
        // this.launchSphere4();
        // this.launchSphere5();
        // this.launchSphere6();
        // this.launchSphere7();
        // this.launchSphere8();
        // this.launchSphere9();
        // this.createDesk();
        this.createDart();
        // this.createDart1();
        // this.createDart2();
    }
    private cancelSphere() {
        this.sphere.destroy();
        setTimeout(() => this.launchSphere(), 100);
    }
    // private cancelSphere1() {
    //     this.sphere1.destroy();
    //     setTimeout(() => this.launchSphere1(), 150);
    // }
    // private cancelSphere2() {
    //     this.sphere2.destroy();
    //     setTimeout(() => this.launchSphere2(), 160);
    // }
    // private cancelSphere3() {
    //     this.sphere3.destroy();
    //     setTimeout(() => this.launchSphere3(), 170);
    // }
    // private cancelSphere4() {
    //     this.sphere4.destroy();
    //     setTimeout(() => this.launchSphere4(), 190);
    // }
    // private cancelSphere5() {
    //     this.sphere5.destroy();
    //     setTimeout(() => this.launchSphere5(), 120);
    // }
    // private cancelSphere6() {
    //     this.sphere6.destroy();
    //     setTimeout(() => this.launchSphere6(), 110);
    // }
    // private cancelSphere7() {
    //     this.sphere7.destroy();
    //     setTimeout(() => this.launchSphere7(), 130);
    // }
    // private cancelSphere8() {
    //     this.sphere8.destroy();
    //     setTimeout(() => this.launchSphere8(), 180);
    // }
    // private cancelSphere9() {
    //     this.sphere9.destroy();
    //     setTimeout(() => this.launchSphere9(), 200);
    // }
    private launchSphere() {
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
                        position: { x: 1.0, y: 0.5, z: 1.0 },
                        scale: { x: 0.4, y: 0.4, z: 0.4 }
                    }
                },

                // collider: {enabled: false,
                //     isTrigger: false,
                //     colliderGeometry: sphereCollider.
                // }
            }
        });
        spherePromise.then(actor => {
            actor.collider.enabled = true;
            actor.collider.isTrigger = true;
        }).catch();
        this.sphere = spherePromise.value;
        const buttonBehavior = this.sphere.setBehavior(ButtonBehavior);
        const timer = setTimeout(() => this.cancelSphere(), 3000);
        buttonBehavior.onClick('pressed', () => {
            clearTimeout(timer);
            this.cancelSphere();
        });
        this.sphere.animateTo({
            transform: {
                local: {
                    position: { y: 0 },
                }
            }
        }, 3, AnimationEaseCurves.Linear);
        // const dartSphereCollider = Collider
        // this.sphere.collider.isTrigger = true;
    }
    // private launchSphere1() {
    //     const rootPromise1 = Actor.CreateEmpty(this.context);
    //     this.root = rootPromise1.value;
    //     const spherePromise1 = Actor.CreatePrimitive(this.context, {
    //         definition: {
    //             shape: PrimitiveShape.Sphere,
    //             radius: 0.9,
    //             uSegments: 8,
    //             vSegments: 4
    //         },
    //         addCollider: true,
    //         actor: {
    //             name: 'Sphere1',
    //             parentId: this.root.id,
    //             transform: {
    //                 local: {
    //                     position: { x: 2.0, y: 1.0, z: 2.0 },
    //                     scale: { x: 0.2, y: 0.2, z: 0.2 }
    //                 }
    //             }
    //         }
    //     });
    //     this.sphere1 = spherePromise1.value;
    //     const buttonBehavior1 = this.sphere1.setBehavior(ButtonBehavior);
    //     const timer1 = setTimeout(() => this.cancelSphere1(), 4000);
    //     buttonBehavior1.onClick('pressed', () => {
    //         clearTimeout(timer1);
    //         this.cancelSphere1();
    //     });
    //     this.sphere1.enableRigidBody({ useGravity: false });
    //     this.sphere1.animateTo({
    //         transform: {
    //             local: {
    //                 position: { y: 7 },
    //             }
    //         }
    //     }, 5, AnimationEaseCurves.Linear);
    // }
    // private launchSphere2() {
    //     const rootPromise2 = Actor.CreateEmpty(this.context);
    //     this.root = rootPromise2.value;
    //     const spherePromise2 = Actor.CreatePrimitive(this.context, {
    //         definition: {
    //             shape: PrimitiveShape.Sphere,
    //             radius: 0.9,
    //             uSegments: 8,
    //             vSegments: 4
    //         },
    //         addCollider: true,
    //         actor: {
    //             name: 'Sphere2',
    //             parentId: this.root.id,
    //             transform: {
    //                 local: {
    //                     position: { x: 4.0, y: 2.0, z: 4.0 },
    //                     scale: { x: 0.4, y: 0.4, z: 0.4 }
    //                 }
    //             }
    //         }
    //     });
    //     this.sphere2 = spherePromise2.value;
    //     const buttonBehavior2 = this.sphere2.setBehavior(ButtonBehavior);
    //     const timer2 = setTimeout(() => this.cancelSphere2(), 5000);
    //     buttonBehavior2.onClick('pressed', () => {
    //         clearTimeout(timer2);
    //         this.cancelSphere2();
    //     });
    //     this.sphere2.enableRigidBody({ useGravity: false });
    //     this.sphere2.animateTo({
    //         transform: {
    //             local: {
    //                 position: { y: 9 },
    //             }
    //         }
    //     }, 7, AnimationEaseCurves.Linear);
    // }
    // private launchSphere3() {
    //     const rootPromise3 = Actor.CreateEmpty(this.context);
    //     this.root = rootPromise3.value;
    //     const spherePromise3 = Actor.CreatePrimitive(this.context, {
    //         definition: {
    //             shape: PrimitiveShape.Sphere,
    //             radius: 0.9,
    //             uSegments: 8,
    //             vSegments: 4
    //         },
    //         addCollider: true,
    //         actor: {
    //             name: 'Sphere3',
    //             parentId: this.root.id,
    //             transform: {
    //                 local: {
    //                     position: { x: 6.0, y: 2.0, z: 6.0 },
    //                     scale: { x: 0.6, y: 0.6, z: 0.6 }
    //                 }
    //             }
    //         }
    //     });
    //     this.sphere3 = spherePromise3.value;
    //     const buttonBehavior3 = this.sphere3.setBehavior(ButtonBehavior);
    //     const timer3 = setTimeout(() => this.cancelSphere3(), 2000);
    //     buttonBehavior3.onClick('pressed', () => {
    //         clearTimeout(timer3);
    //         this.cancelSphere3();
    //     });
    //     this.sphere3.enableRigidBody({ useGravity: false });
    //     this.sphere3.animateTo({
    //         transform: {
    //             local: {
    //                 position: { y: 3 },
    //             }
    //         }
    //     }, 7, AnimationEaseCurves.Linear);
    // }
    // private launchSphere4() {
    //     const rootPromise4 = Actor.CreateEmpty(this.context);
    //     this.root = rootPromise4.value;
    //     const spherePromise4 = Actor.CreatePrimitive(this.context, {
    //         definition: {
    //             shape: PrimitiveShape.Sphere,
    //             radius: 0.9,
    //             uSegments: 8,
    //             vSegments: 4
    //         },
    //         addCollider: true,
    //         actor: {
    //             name: 'Sphere4',
    //             parentId: this.root.id,
    //             transform: {
    //                 local: {
    //                     position: { x: 8.0, y: 8.0, z: 8.0 },
    //                     scale: { x: 0.7, y: 0.7, z: 0.7 }
    //                 }
    //             }
    //         }
    //     });
    //     this.sphere4 = spherePromise4.value;
    //     const buttonBehavior4 = this.sphere4.setBehavior(ButtonBehavior);
    //     const timer4 = setTimeout(() => this.cancelSphere4(), 4000);
    //     buttonBehavior4.onClick('pressed', () => {
    //         clearTimeout(timer4);
    //         this.cancelSphere4();
    //     });
    //     this.sphere4.enableRigidBody({ useGravity: false });
    //     this.sphere4.animateTo({
    //         transform: {
    //             local: {
    //                 position: { y: 2 },
    //             }
    //         }
    //     }, 7, AnimationEaseCurves.Linear);
    // }
    // private launchSphere5() {
    //     const rootPromise5 = Actor.CreateEmpty(this.context);
    //     this.root = rootPromise5.value;
    //     const spherePromise5 = Actor.CreatePrimitive(this.context, {
    //         definition: {
    //             shape: PrimitiveShape.Sphere,
    //             radius: 0.9,
    //             uSegments: 8,
    //             vSegments: 4
    //         },
    //         addCollider: true,
    //         actor: {
    //             name: 'Sphere5',
    //             parentId: this.root.id,
    //             transform: {
    //                 local: {
    //                     position: { x: 10.0, y: 2.0, z: 10.0 },
    //                     scale: { x: 0.9, y: 0.9, z: 0.9 }
    //                 }
    //             }
    //         }
    //     });
    //     this.sphere5 = spherePromise5.value;
    //     const buttonBehavior5 = this.sphere5.setBehavior(ButtonBehavior);
    //     const timer5 = setTimeout(() => this.cancelSphere5(), 6000);
    //     buttonBehavior5.onClick('pressed', () => {
    //         clearTimeout(timer5);
    //         this.cancelSphere5();
    //     });
    //     this.sphere5.enableRigidBody({ useGravity: false });
    //     this.sphere5.animateTo({
    //         transform: {
    //             local: {
    //                 position: { y: 9 },
    //             }
    //         }
    //     }, 7, AnimationEaseCurves.Linear);
    // }
    // private launchSphere6() {
    //     const rootPromise6 = Actor.CreateEmpty(this.context);
    //     this.root = rootPromise6.value;
    //     const spherePromise6 = Actor.CreatePrimitive(this.context, {
    //         definition: {
    //             shape: PrimitiveShape.Sphere,
    //             radius: 0.9,
    //             uSegments: 8,
    //             vSegments: 4
    //         },
    //         addCollider: true,
    //         actor: {
    //             name: 'Sphere6',
    //             parentId: this.root.id,
    //             transform: {
    //                 local: {
    //                     position: { x: 12.0, y: 2.0, z: 12.0 },
    //                     scale: { x: 0.8, y: 0.8, z: 0.8 }
    //                 }
    //             }
    //         }
    //     });
    //     this.sphere6 = spherePromise6.value;
    //     const buttonBehavior6 = this.sphere6.setBehavior(ButtonBehavior);
    //     const timer6 = setTimeout(() => this.cancelSphere6(), 7000);
    //     buttonBehavior6.onClick('pressed', () => {
    //         clearTimeout(timer6);
    //         this.cancelSphere6();
    //     });
    //     this.sphere6.enableRigidBody({ useGravity: false });
    //     this.sphere6.animateTo({
    //         transform: {
    //             local: {
    //                 position: { y: 6 },
    //             }
    //         }
    //     }, 7, AnimationEaseCurves.Linear);
    // }
    // private launchSphere7() {
    //     const rootPromise7 = Actor.CreateEmpty(this.context);
    //     this.root = rootPromise7.value;
    //     const spherePromise7 = Actor.CreatePrimitive(this.context, {
    //         definition: {
    //             shape: PrimitiveShape.Sphere,
    //             radius: 0.9,
    //             uSegments: 8,
    //             vSegments: 3
    //         },
    //         addCollider: true,
    //         actor: {
    //             name: 'Sphere7',
    //             parentId: this.root.id,
    //             transform: {
    //                 local: {
    //                     position: { x: 14.0, y: 2.0, z: 14.0 },
    //                     scale: { x: 0.4, y: 0.4, z: 0.4 }
    //                 }
    //             }
    //         }
    //     });
    //     this.sphere7 = spherePromise7.value;
    //     const buttonBehavior7 = this.sphere7.setBehavior(ButtonBehavior);
    //     const timer7 = setTimeout(() => this.cancelSphere7(), 8000);
    //     buttonBehavior7.onClick('pressed', () => {
    //         clearTimeout(timer7);
    //         this.cancelSphere7();
    //     });
    //     this.sphere7.enableRigidBody({ useGravity: false });
    //     this.sphere7.animateTo({
    //         transform: {
    //             local: {
    //                 position: { y: 8 },
    //             }
    //         }
    //     }, 7, AnimationEaseCurves.Linear);
    // }
    // private launchSphere8() {
    //     const rootPromise8 = Actor.CreateEmpty(this.context);
    //     this.root = rootPromise8.value;
    //     const spherePromise8 = Actor.CreatePrimitive(this.context, {
    //         definition: {
    //             shape: PrimitiveShape.Sphere,
    //             radius: 0.9,
    //             uSegments: 8,
    //             vSegments: 4
    //         },
    //         addCollider: true,
    //         actor: {
    //             name: 'Sphere8',
    //             parentId: this.root.id,
    //             transform: {
    //                 local: {
    //                     position: { x: 16.0, y: 2.0, z: 16.0 },
    //                     scale: { x: 0.4, y: 0.4, z: 0.4 }
    //                 }
    //             }
    //         }
    //     });
    //     this.sphere8 = spherePromise8.value;
    //     const buttonBehavior8 = this.sphere8.setBehavior(ButtonBehavior);
    //     const timer8 = setTimeout(() => this.cancelSphere8(), 9000);
    //     buttonBehavior8.onClick('pressed', () => {
    //         clearTimeout(timer8);
    //         this.cancelSphere8();
    //     });
    //     this.sphere8.enableRigidBody({ useGravity: false });
    //     this.sphere8.animateTo({
    //         transform: {
    //             local: {
    //                 position: { y: 0 },
    //             }
    //         }
    //     }, 7, AnimationEaseCurves.Linear);
    // }
    // private launchSphere9() {
    //     const rootPromise9 = Actor.CreateEmpty(this.context);
    //     this.root = rootPromise9.value;
    //     const spherePromise9 = Actor.CreatePrimitive(this.context, {
    //         definition: {
    //             shape: PrimitiveShape.Sphere,
    //             radius: 0.9,
    //             uSegments: 8,
    //             vSegments: 4
    //         },
    //         addCollider: true,
    //         actor: {
    //             name: 'Sphere9',
    //             parentId: this.root.id,
    //             transform: {
    //                 local: {
    //                     position: { x: 5.0, y: 2.0, z: 5.0 },
    //                     scale: { x: 0.4, y: 0.4, z: 0.4 }
    //                 }
    //             }
    //         }
    //     });
    //     this.sphere9 = spherePromise9.value;
    //     const buttonBehavior9 = this.sphere9.setBehavior(ButtonBehavior);
    //     const timer9 = setTimeout(() => this.cancelSphere9(), 5555);
    //     buttonBehavior9.onClick('pressed', () => {
    //         clearTimeout(timer9);
    //         this.cancelSphere9();
    //     });
    //     this.sphere9.enableRigidBody({ useGravity: false });
    //     this.sphere9.animateTo({
    //         transform: {
    //             local: {
    //                 position: { y: 10 },
    //             }
    //         }
    //     }, 7, AnimationEaseCurves.Linear);
    // }
    // private createDesk() {

    //     const deskPromise = Actor.CreateFromGLTF(this.context, {
    //         // at the given URL
    //         resourceUrl: `${this.baseUrl}/table.glb`,
    //         // and spawn box colliders around the meshes.
    //         colliderType: 'box',
    //         // Also apply the following generic actor properties.
    //         actor: {
    //             name: 'Desk',
    //             // Parent the glTF model to the text actor.
    //             transform: {
    //                 local: {
    //                     position: { x: 0, y: -2, z: 0 },
    //                     scale: { x: 0.4, y: 0.4, z: 0.4 },
    //                     rotation: Quaternion.FromEulerAngles(0, -Math.PI, 0),
    //                 }
    //             }
    //         }
    //     });
    //     this.desk = deskPromise.value;
    // }
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
                        // tslint:disable-next-line: max-line-length

                    }
                },
                grabbable: true
            }
        });
        this.dart = dartPromise.value;
        this.dart.onGrab("end", () => {
// tslint:disable-next-line: max-line-length
            //Will we need this rotation? Do we want the darts to lock onto the baloons, or do we want the player to aim the dart and then throw.
            this.dart.transform.local.rotation = Quaternion.LookAt(this.dart.transform.local.position, this.sphere.transform.local.position);
// tslint:disable-next-line: max-line-length
            //Animimate to should work, however is this the behavior we want? If we want the darts to track and target the spheres yes, if not we should try and figure out how to animate the darts
            //as an "arc"
            this.dart.animateTo({ transform: { local: { position: this.sphere.transform.local.position } } }, 3, AnimationEaseCurves.Linear);
            this.dart.collider.isTrigger = true;
            // We'll need to put some conditional logic somewhere in here. For example "if dart position == sphere position sphere.destroy()" or something along those lines. 

        });
    }

    //instead of hard coding every dart, we can probably put this into a for loop
    private createDart1() {

        const dartPromise1 = Actor.CreateFromGLTF(this.context, {
            // at the given URL
            resourceUrl: `${this.baseUrl}/11750_throwing_dart_v1_L3.glb`,
            // and spawn box colliders around the meshes.
            colliderType: 'box',
            // Also apply the following generic actor properties.
            actor: {
                name: 'Dart',
                // Parent the glTF model to the text actor.
                transform: {
                    local: {
                        position: { x: 0, y: -.5, z: 0 },
                        scale: { x: .05, y: .05, z: .05 },
                        rotation: Quaternion.FromEulerAngles(0, -Math.PI, 0),
                    }
                },
                grabbable: true
            }
        });
        this.dart1 = dartPromise1.value;
        this.dart1.enableRigidBody({ useGravity: false });
        this.dart1.onGrab("end", () => {
            this.dart1.rigidBody.velocity = 10;
        });
    }
    private createDart2() {

        const dartPromise2 = Actor.CreateFromGLTF(this.context, {
            // at the given URL
            resourceUrl: `${this.baseUrl}/11750_throwing_dart_v1_L3.glb`,
            // and spawn box colliders around the meshes.
            colliderType: 'box',
            // Also apply the following generic actor properties.
            actor: {
                name: 'Dart',
                // Parent the glTF model to the text actor.
                transform: {
                    local: {
                        position: { x: 1, y: -.5, z: 0 },
                        scale: { x: 0.05, y: 0.05, z: 0.05 },
                        rotation: Quaternion.FromEulerAngles(0, -Math.PI, 0),
                    }
                },
                grabbable: true
            }
        });
        this.dart2 = dartPromise2.value;
        this.dart2.enableRigidBody({ useGravity: false });
        this.dart2.onGrab("end", () => {
            this.dart2.rigidBody.velocity = 10;
        });
    }
}
