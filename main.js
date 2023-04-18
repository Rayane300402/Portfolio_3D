import './style.css'
import * as THREE from 'three';

const scene = new THREE.Scene();

// mimic what humans see, arg one is filed view, secind is aspect ration aka windows size, last 2 are for the View Frustum to control which object are visible relative to the camera itself, .1 & 1000 == see everything from lense
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// renderer to render the actual graphics to the scene , should know which DOM elements to use 
const renderer = new THREE.WebGLRenderer({
  canvas : document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio);
// make it a full screen canvas
renderer.setSize(window.innerWidth, window.innerHeight);
// reposition camera to move along Z axis
camera.position.setZ(30);

renderer.render(scene, camera);

// create object 