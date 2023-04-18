import './style.css'
import * as THREE from 'three';
// make scene more interactive via Orbit Controls
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

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

// create object to fill empty screen
// first create a geometry the set of vectors{x,y,z} points that makeup a shape
// TorusGeometry == Ring, build in check Docs
const geometry = new THREE.TorusGeometry(10,3,16,100)
// second we need to define a material -> the texture, wrapping paper for an object
// build in, check docs, can also custom via WebGL, 
// most materials relie on light source, but MeshBasic does not require one
// has paarmeteres for custom, wirefram is true to get a better look at the geomtry
// meshStandard will react light bouncing off of it
// won't appear so as long as there are no light source
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
// third is creatibg a  mesh by adding geometry & material together
const torus = new THREE.Mesh(geometry, material);
scene.add(torus)

// many types, check docs
const pointLight = new THREE.PointLight(0xffffff)
// moving light from center by positioning it along the x,y & z axis
pointLight.position.set(20,20,20)

// lighting accross the scene, a flood light in the room & light up the scene equally
const ambientLight = new THREE.AmbientLight(0xffffff)
// add it to scene so we can see it
scene.add(pointLight, ambientLight) //currently inside torus cz (5,5,5), if we update the numbers it'll move far away and light's up accros the torus

// show us position of pointLight, you can spot a wireframe
const lightHelper = new THREE.PointLightHelper(pointLight)
// grid helper, creates a 2d grid 
// it's a horizontal line cz our perspective is in line with teh grid
const gridHelper = new THREE.GridHelper(200,50)
scene.add(lightHelper, gridHelper)

// listen dom events on mouse and update, pan around your mouse to see the full grid
const controls = new OrbitControls(camera, renderer.domElement);

function addStar(){
  const geometry2 = new THREE.SphereGeometry(0.25,24,24);
  const material2 = new THREE.MeshStandardMaterial({color: 0xffffff})
  const star = new THREE.Mesh(geometry2,material2);

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x,y,z)
  scene.add(star)

}

Array(200).fill().forEach(addStar)
// bg
const spaceTexture = new THREE.TextureLoader().load('/img/space.jpg');
scene.background = spaceTexture

// avatar
const rayTexture = new THREE.TextureLoader().load('/img/Ray.jpeg');
const Ray = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial( {map: rayTexture})
)

scene.add(Ray)

// Moon
const moonTexture = new THREE.TextureLoader().load('/img/moon.jpg')
const normalTexture = new THREE.TextureLoader().load('/img/normal.jpg')
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
)
scene.add(moon)

// direction we're scrollingin
moon.position.z = 30;
moon.position.setX(-10)

// event handle for body onScroll
// fire function every time user scrolls
function moveCamera(){
// calculate where user i s currently scorlled to
  const t =document.body.getBoundingClientRect().top;

  moon.rotation.x +=0.05
  moon.rotation.y +=0.075
  moon.rotation.z +=0.05

  Ray.rotation.y +=0.01
  Ray.rotation.z +=0.01

  camera.position.z = t * -0.01
  camera.position.x = t * -0.0002
  camera.position.y = t * -0.0002

}

document.body.onscroll = moveCamera;
moveCamera();



// instead of calling renderer over and over again, create recursive function
function animate() {
  // tell browser you want to perform an animation
  requestAnimationFrame(animate);
  // so the shape cana ctually do something
  // if we change property of shapes (rotation, scale...) inside the loop it'll animate
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  // update can be reflected on UI
  controls.update();

  // call render method to UI
  renderer.render(scene, camera)
}

animate()