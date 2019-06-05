/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {
    Actor,
    AnimationEaseCurves,
    ButtonBehavior,
    Context,
    PrimitiveShape} from '@microsoft/mixed-reality-extension-sdk';
/**
 * The main class of this app. All the logic goes here.
 */
export default class GameGallery {
    private root: Actor;
    private sphere: Actor;

    constructor(private context: Context, private baseUrl: string) {
        this.context.onStarted(() => this.started());
    }
    /**
     * Once the context is "started", initialize the app.
     */
    private started() {
        this.launchSphere();
    }
    private cancelSphere() {
        this.sphere.destroy();
        setTimeout(() => this.launchSphere(), 100);
    }
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
                name: 'Button',
                parentId: this.root.id,
                transform: {
                    local: {
                        position: { x: 1.0, y: 0.5, z: 1.0 },
                        scale: { x: 0.4, y: 0.4, z: 0.4 }
                    }
                }
            }
        });
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
                position: { y: 5 },
                }
            }
        }, 3, AnimationEaseCurves.Linear);
    }
}
