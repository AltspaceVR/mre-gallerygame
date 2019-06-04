/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    Actor,
    AnimationEaseCurves,
    AnimationKeyframe,
    AnimationWrapMode,
    ButtonBehavior,
    Context,
    PrimitiveShape,
    Quaternion,
    TextAnchorLocation,
    Vector3
} from '@microsoft/mixed-reality-extension-sdk';

/**
 * The main class of this app. All the logic goes here.
 */
export default class GameGallery {
    private text: Actor = null;
    private sphere: Actor = null;

    constructor(private context: Context, private baseUrl: string) {
        this.context.onStarted(() => this.started());
    }

    /**
     * Once the context is "started", initialize the app.
     */
    private started() {
        // Create a new actor with no mesh, but some text. This operation is asynchronous, so
        // it returns a "forward" promise (a special promise, as we'll see later).
        const textPromise = Actor.CreateEmpty(this.context, {
            actor: {
                name: 'Text',
                transform: {
                    app: { position: { x: 0, y: 0.5, z: 0 } }
                },
                // text: {
                //     contents: "Game Gallery",
                //     anchor: TextAnchorLocation.MiddleCenter,
                //     color: { r: 30 / 255, g: 206 / 255, b: 213 / 255 },
                //     height: 0.3
                // }
            }
        });
        this.text = textPromise.value;

        // this.text.createAnimation(
        //     "Spin", {
        //         keyframes: this.generateSpinKeyframes(20, Vector3.Down()),
        //         events: [],
        //         wrapMode: AnimationWrapMode.PingPong
        //     });

        // for (let tileIndexX = 0; tileIndexX < 3; tileIndexX++) {
        //     for (let tileIndexZ = 0; tileIndexZ < 3; tileIndexZ++) {

        const spherePromise = Actor.CreatePrimitive(this.context, {
                    definition: {
                        shape: PrimitiveShape.Sphere,
                        radius: 0.9,
                        uSegments: 8,
                        vSegments: 4

                    },
                    addCollider: true,
                    actor: {
                        name: 'Button',
                        parentId: this.text.id,
                        transform: {
                            local: {
                                position: { x: 1.0, y: 0.5, z: 1.0 },
                            // position: { x: (tileIndexX) - 1.0, y: 0.5, z: (tileIndexZ) - 1.0 },
                            scale: { x: 0.4, y: 0.4, z: 0.4 }
                            }
                        }
                    }
                });
        this.sphere = spherePromise.value;
        const buttonBehavior = this.sphere.setBehavior(ButtonBehavior);
        buttonBehavior.onClick('pressed', () => {
            this.sphere.animateTo(
            { transform: { local: { scale: { x: 0, y: 0, z: 0 } } } }, 0.0, AnimationEaseCurves.EaseOutSine);
        });
    }
}

//         // Here we create an animation on our text actor. Animations have three mandatory arguments:
//         // a name, an array of keyframes, and an array of events.
//         this.text.createAnimation(
//             // The name is a unique identifier for this animation. We'll pass it to "startAnimation" later.
//             "Spin", {
//                 // Keyframes define the timeline for the animation: where the actor should be, and when.
//                 // We're calling the generateSpinKeyframes function to produce a simple 20-second revolution.
//                 keyframes: this.generateSpinKeyframes(20, Vector3.Down()),
//                 // Events are points of interest during the animation. The animating actor will emit a given
//                 // named event at the given timestamp with a given string value as an argument.
//                 events: [],

//                 // Optionally, we also repeat the animation infinitely. PingPong alternately runs the animation
//                 // foward then backward.
//                 wrapMode: AnimationWrapMode.PingPong
//             });

//         for (let tileIndexX = 0; tileIndexX < 3; tileIndexX++) {
//         for (let tileIndexZ = 0; tileIndexZ < 3; tileIndexZ++) {

//             const cubePromise = Actor.CreatePrimitive(this.context, {
//                 definition: {
//                     shape: PrimitiveShape.Sphere,
//                     radius: 0.9,
//                     uSegments: 8,
//                     vSegments: 4

//                 },
//                 addCollider: true,
//                 actor: {
//                     name: 'Button',
//                     parentId: this.text.id,
//                     transform: {
//                         local: {
//                         position: { x: (tileIndexX) - 1.0, y: 0.5, z: (tileIndexZ) - 1.0 },
//                         scale: { x: 0.4, y: 0.4, z: 0.4 }
//                         }
//                     }
//                 }
//             });

//         // // Load a glTF model
//         // const cubePromise = Actor.CreateFromGLTF(this.context, {
//         //     // at the given URL
//         //     resourceUrl: `${this.baseUrl}/altspace-cube.glb`,
//         //     // and spawn box colliders around the meshes.
//         //     colliderType: 'box',
//         //     // Also apply the following generic actor properties.
//         //     actor: {
//         //         name: 'Altspace Cube',
//         //         // Parent the glTF model to the text actor.
//         //         parentId: this.text.id,
//         //         transform: {
//         //             local: {
//         //                 position: { x: (tileIndexX) - 1.0, y: 0.5, z: (tileIndexZ) - 1.0 },
//         //                 scale: { x: 0.4, y: 0.4, z: 0.4 }
//         //             }
//         //         }
//         //     }
//         // });

//         // Grab that early reference again.
//             this.cube = cubePromise.value;

//         // Create some animations on the cube.
//             this.cube.createAnimation(
//             'DoAFlip', {
//                 keyframes: this.generateSpinKeyframes(0, Vector3.Left()),
//                 events: []
//             });

//         // Now that the text and its animation are all being set up, we can start playing
//         // the animation.
//             this.text.enableAnimation('Spin');

//         // Set up cursor interaction. We add the input behavior ButtonBehavior to the cube.
//         // Button behaviors have two pairs of events: hover start/stop, and click start/stop.
//             const buttonBehavior = this.cube.setBehavior(ButtonBehavior);

//         // Trigger the grow/shrink animations on hover.
//             buttonBehavior.onHover('enter', () => {
//             this.cube.animateTo(
//                 { transform: { local: { scale: { x: 4, y: 4, z: 4 } } } }, 0.3, AnimationEaseCurves.EaseOutSine);
//         });
//             buttonBehavior.onHover('exit', () => {
//             this.cube.animateTo(
// tslint:disable-next-line: max-line-length
//                 { transform: { local: { scale: { x: 0.4, y: 0.4, z: 0.4 } } } }, 0.3, AnimationEaseCurves.EaseOutSine);
//         });

//         // When clicked, do a 360 sideways.
//             buttonBehavior.onClick('pressed', () => {
//             this.cube.enableAnimation('DoAFlip');
//         });
//     }

//     /**
//      * Generate keyframe data for a simple spin animation.
//      * @param duration The length of time in seconds it takes to complete a full revolution.
//      * @param axis The axis of rotation in local space.
//      */
// }}
//      private generateSpinKeyframes(duration: number, axis: Vector3): AnimationKeyframe[] {
//         return [{
//             time: 0 * duration,
//             value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, 0) } } }
//         }, {
//             time: 0.25 * duration,
//             value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, Math.PI / 2) } } }
//         }, {
//             time: 0.5 * duration,
//             value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, Math.PI) } } }
//         }, {
//             time: 0.75 * duration,
//             value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, 3 * Math.PI / 2) } } }
//         }, {
//             time: 1 * duration,
//             value: { transform: { local: { rotation: Quaternion.RotationAxis(axis, 2 * Math.PI) } } }
//         }];
//     }
// }
