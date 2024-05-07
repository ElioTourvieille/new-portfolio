"use client"

import * as THREE from 'three'
import {Canvas, useFrame} from '@react-three/fiber'
import {ContactShadows, Float, Environment} from "@react-three/drei";
import {Suspense, useRef, useEffect, useState} from 'react'
import {gsap} from 'gsap'

import faceTexture from '@/public/images/recto-card.png';
import versoTexture from '@/public/images/verso-card.jpg';
import coinTextureImage from '@/public/images/chip.png';

export default function Shapes() {
    return (
        <div className="row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0">
            <Canvas className="z-0" shadows gl={{antialias: false}} dpr={[1, 1.5]}
                    camera={{position: [0, 0, 25], fov: 30, near: 1, far: 40}}>
                <Suspense fallback={null}>
                    <Geometries/>
                    <Chips/>
                    <ContactShadows
                        postion={[0, -3.5, 0]}
                        opacity={0.65}
                        scale={40}
                        blur={1}
                        far={10}/>
                    <Environment preset="studio"/>
                </Suspense>
            </Canvas>
        </div>
    )
}

function Geometries() {
    const geometries = [
        {
            position: [0, 0, 1],
            height: 0.5,
            r: 0.5,
            geometry: new THREE.PlaneGeometry(3.5, 5)
        }
    ]

    const frontTexture = new THREE.TextureLoader().load(faceTexture.src);
    const backTexture = new THREE.TextureLoader().load(versoTexture.src);

    const materials = [
        new THREE.MeshBasicMaterial({map: frontTexture, side: THREE.DoubleSide}), // Recto of the poker card
        new THREE.MeshBasicMaterial({map: backTexture, side: THREE.DoubleSide}) // Verso of the poker card
    ]

    return (
        <>
            {geometries.map(({position, r, geometry}) => (
                <Geometry
                    key={JSON.stringify(position)}
                    position={position.map((p) => p * 2)}
                    geometry={geometry}

                    materials={materials}
                    r={r}
                />
            ))}
        </>
    )
}

function Chips() {
    const chips = [
        {position: [3, 1, 0], radius: 1, height: 0.25, r: 0.5},
        {position: [-3, -1, 7], radius: 1, height: 0.25, r: 0.5}
    ]

    const chipTexture = new THREE.TextureLoader().load(coinTextureImage.src);

    const materials = [
        new THREE.MeshBasicMaterial({map: chipTexture}) // Utilisez la texture pour le matériau
    ]

    return (
        <>
            {chips.map(({position, radius, height, r}) => (
                <Chip
                    key={JSON.stringify(position)}
                    position={position}
                    radius={radius}
                    height={height}
                    materials={materials}
                    r={r}
                />
            ))}
        </>
    )
}

function Geometry({r, position, geometry, materials}) {
    const meshRef = useRef()

    const [frontMaterial, backMaterial] = materials;

    // Check if the card is flipped or not
    const [flipped, setFlipped] = useState(false);

    // Add a state to check if the animation has already been triggered
    const [animated, setAnimated] = useState(false);

    function handleClick(e) {
        const mesh = e.object

        gsap.to(mesh.rotation, {
            x: `+=${gsap.utils.random(0, 1)}`,
            y: `+=${gsap.utils.random(0, 1)}`,
            z: `+=${gsap.utils.random(0, 1)}`,
            duration: 1.3,
            ease: 'elastic.out(1, 0.3)',
            yoyo: true
        })
        // Flip the card
        setFlipped(!flipped);
    }

    const handlePointerOver = (e) => {
        document.body.style.cursor = 'pointer'
    }
    const handlePointerOut = (e) => {
        document.body.style.cursor = 'default'
    }

    useEffect(() => {
        // Only trigger the animation if it hasn't been triggered yet
        if (!animated) {
            let ctx = gsap.context(() => {
                gsap.from(meshRef.current.scale, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 1.5,
                    ease: 'elastic.out(1,0.3)',
                    delay: 0.4
                })
                return () => ctx.revert() // Clean up
            }, [])
            // Set the animated state to true after the animation has been triggered
            setAnimated(true);
        }
    })

        const currentMaterial = flipped ? backMaterial : frontMaterial;

        return (
            <group position={position} ref={meshRef}>
                <Float speed={5 * r} rotationIntensity={6 * r} floatIntensity={5 * r}>
                    <mesh
                        geometry={geometry}
                        material={currentMaterial}
                        position={position}
                        onClick={handleClick}
                        onPointerOver={handlePointerOver}
                        onPointerOut={handlePointerOut}
                    />
                </Float>
            </group>
        )
    }

    function Chip({position, radius, height, materials, r}) {
        const meshRef = useRef()

        const startingMaterial = materials[0];

        function handleClick(e) {
            const mesh = e.object

            gsap.to(mesh.rotation, {
                x: `+=${gsap.utils.random(0, 2)}`,
                y: `+=${gsap.utils.random(0, 2)}`,
                z: `+=${gsap.utils.random(0, 2)}`,
                duration: 1.3,
                ease: 'elastic.out(1, 0.3)',
                yoyo: true
            })
        }

        const handlePointerOver = (e) => {
            document.body.style.cursor = 'pointer'
        }
        const handlePointerOut = (e) => {
            document.body.style.cursor = 'default'
        }

        useEffect(() => {
            let ctx = gsap.context(() => {
                gsap.from(meshRef.current.scale, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 1.5,
                    ease: 'elastic.out(1,0.3)',
                    delay: 0.4
                })
                return () => ctx.revert() // Clean up
            }, [])
        })

        return (
            <group position={position} ref={meshRef}>
                <Float speed={5 * r} rotationIntensity={6 * r} floatIntensity={5 * r}>
                    <mesh
                        position={[0, height / 2, 0]}
                        onClick={handleClick}
                        onPointerOver={handlePointerOver}
                        onPointerOut={handlePointerOut}
                    >
                        <cylinderGeometry args={[radius, radius, height, 32]}/>
                        <meshBasicMaterial {...startingMaterial} />
                    </mesh>
                </Float>
            </group>
        )
    }