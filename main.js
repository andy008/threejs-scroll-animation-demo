import './style.css';
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';


//  Game
let ship, container, enemy = [], missile = [], pup = [], enspeed = [];
let xspeed = 0, zspeed = 0;
let missilecount = 0;
let score = 0, health = 100000;
let i,j
let maxPlayerWidth, maxPupWidth, maxEnemyWidth;
let checkjx, checkix;
let booted = false;

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
  alpha: true,
});
renderer.autoClear = false;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0.0);
camera.position.setZ(30);
camera.position.setX(-3);


renderer.render(scene, camera);

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0x033F98 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar(){

  // The loop will move from z position of -1000 to z position 1000, adding a random particle at each position. 
  for ( var z= -500; z < 500; z+=20 ) {

    // Make a sphere (exactly the same as before). 
    var geometry   = new THREE.SphereGeometry(0.5, 32, 32)
    var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    var sphere = new THREE.Mesh(geometry, material)

    // This time we give the sphere random x and y positions between -500 and 500
    sphere.position.x = Math.random() * 1000 - 500;
    sphere.position.y = Math.random() * 1000 - 500;

    // Then set the z position to where it is in the loop (distance of camera)
    sphere.position.z = z;

    // scale it up a bit
    sphere.scale.x = sphere.scale.y = 2;

    //add the sphere to the scene
    scene.add( sphere );

  }
}


addStar();

// Background

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Cube

var loader = new THREE.TextureLoader();
var mats = [
  'ive.png', 
  'borg-af.gif',
  'ive.png', 
  'borg-af.gif',
  'ive.png', 
  'troy.png',
].map(pic => {
  return new THREE.MeshLambertMaterial({map: loader.load(pic)});
});
const geom = new THREE.BoxBufferGeometry(2, 2, 2);
const jeff = new THREE.Mesh(geom, mats);

scene.add(jeff);

// Moon

const moonTexture = new THREE.TextureLoader().load('earth.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  }),
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

jeff.position.z = -4;
jeff.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  //moon.rotation.x += 0.05;
  //moon.rotation.y += 0.075;
  //moon.rotation.z += 0.05;

  jeff.rotation.y += 0.01;
  jeff.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.y += 0.001;

  jeff.rotation.y += 0.0025;
  jeff.rotation.z += 0.0025;  

  // controls.update();

  renderer.render(scene, camera);
}

animate();




// game functions

function envinit() {
  //container = document.querySelector('.scene');
  //scene = new THREE.Scene();
  //camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  //renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  //renderer.setSize(window.innerWidth, window.innerHeight);
  //container.appendChild(renderer.domElement);

  //camera.position.set(0, 40, 50);

  //camera.rotation.x = -0.4;

  scene.remove(torus);
  scene.remove(jeff);

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

  const light = new THREE.DirectionalLight(0xffffff, 5);
  light.position.set(0, 20, -200);
  scene.add(light);
}

function shipinit() {
  let loader = new GLTFLoader();
  loader.load('newship/scene.gltf', function (gltf) {
      scene.add(gltf.scene);
      ship = gltf.scene.children[0];

      ship.rotation.z = 3.1415;

      ship.scale.x = 0.12;
      ship.scale.y = 0.12;
      ship.scale.z = 0.12;

      renderer.render(scene, camera);
  });
}

function enemyinit(num) {
  let loader = new GLTFLoader();
  loader.load('newship2/scene.gltf', function (gltf) {
      scene.add(gltf.scene);
      enemy[num] = gltf.scene.children[0];

      maxEnemyWidth = (Math.random() - 0.5) * (window.innerWidth / 100) * 6;

      enemy[num].position.set(maxEnemyWidth, 0, (num * 100) - 1228);

      enemy[num].scale.x = 0.4;
      enemy[num].scale.y = 0.4;
      enemy[num].scale.z = 0.4;

      if (Math.random() > 0.5)
          enspeed[num] = 0.15
      else enspeed[num] = -0.15

      renderer.render(scene, camera);
  });
}

function pupinit(num) {
  let loader = new GLTFLoader();
  loader.load('pup/scene.gltf', function (gltf) {
      scene.add(gltf.scene);
      pup[num] = gltf.scene.children[0];

      maxPupWidth = (Math.random() - 0.5) * (window.innerWidth / 100) * 6;

      pup[num].position.set(maxPupWidth, -2, (num * 100) - 1278);

      pup[num].scale.x *= 10;
      pup[num].scale.y *= 10;
      pup[num].scale.z *= 10;

      renderer.render(scene, camera);
  });
}

function missileinit(num, xaxis, zaxis) {
  let loader = new GLTFLoader();
  loader.load('missile/scene.gltf', function (gltf) {
      scene.add(gltf.scene);
      missile[num] = gltf.scene.children[0];

      missile[num].position.set(xaxis, 0, zaxis);

      missile[num].scale.y *= 0.25;

      renderer.render(scene, camera);
  });
}

function loop() {
  requestAnimationFrame(loop);

  for (i = 0; i < 10; i++) {
      for (j = 0; j < missilecount; j++) {
          if (missile[j])
              if (missile[j].position.z < -800)
                  continue;
          if (missile[j] && enemy[i]) {
              checkix = enemy[i].position.x;
              checkjx = missile[j].position.x;
              if ((checkjx < checkix + 5) && (checkjx > checkix - 5) && (missile[j].position.z == enemy[i].position.z + 5)) {
                  enemy[i].position.z -= 1000;
                  missile[j].position.z -= 1000;
                  score += 1;
                  document.getElementById("scorehere").innerHTML = score;
              }
          }
      }

      if (ship && enemy[i]) {
          checkjx = ship.position.x;
          checkix = enemy[i].position.x;
          if ((checkjx < checkix + 5) && (checkjx > checkix + 5) && (ship.position.z == enemy[i].position.z + 5)) {
              enemy[i].position.z -= 1000;
              health -= 10000;
              document.getElementById("healthhere").innerHTML = health;
          }
      }

      if (ship && pup[i]) {
          checkjx = ship.position.x;
          checkix = pup[i].position.x;
          if ((checkjx < checkix + 5) && (checkjx > checkix - 5) && (ship.position.z == pup[i].position.z + 5)) {
              pup[i].position.z -= 1000;
              health += 1000;
              document.getElementById("healthhere").innerHTML = health;
          }
      }
  }

  maxPlayerWidth = (window.innerWidth / 100) * 3;

  if (ship) {
      if (ship.position.z + zspeed < 1 && ship.position.z + zspeed > -60)
          ship.position.z += zspeed;
      if (ship.position.x + xspeed < maxPlayerWidth && ship.position.x + xspeed > -maxPlayerWidth)
          ship.position.x += xspeed;

      enemy.forEach(ship => {
          ship.position.z += 1;

          //add enspeed to x coord
          //if at edge, flip enspeed

          if (ship.position.x >= maxPlayerWidth || ship.position.x <= -maxPlayerWidth) {
              enspeed[enemy.indexOf(ship)] = -enspeed[enemy.indexOf(ship)]
              ship.position.x += enspeed[enemy.indexOf(ship)]
          }

          if (ship.position.x < maxPlayerWidth && ship.position.x > -maxPlayerWidth)
              ship.position.x += enspeed[enemy.indexOf(ship)]

          if (ship.position.z > 2500) {
              ship.position.x = (Math.random() - 0.5) * (window.innerWidth / 100) * 6;
              ship.position.z = -1028;
          }
      });

      pup.forEach(ship => {
          ship.position.z += 1;
          if (ship.position.z > 20) {
              ship.position.x = (Math.random() - 0.5) * (window.innerWidth / 100) * 6;
              ship.position.z = -1028;
          }
      });
  }

  for (i = 0; i < missilecount; i++) {
      if (missile[i])
          if (missile[i].position.z < 1500)
              missile[i].position.z -= 3;
  }

  if (health <= 0) {
      document.getElementById("gameover").innerHTML = "GAME OVER";
      return;
  }

  renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onClick(event) {
  if (ship) {
      const keyCode = event.which;
      if (keyCode == 87)
          zspeed = -1;
      else if (keyCode == 83)
          zspeed = 1;
      else if (keyCode == 65)
          xspeed = -1;
      else if (keyCode == 68)
          xspeed = 1;

      if (keyCode == 16) {
          missileinit(missilecount, ship.position.x, ship.position.z);
          missilecount++;
      }
  }
}

function onStop(event) {
  if (ship) {
      const keyCode = event.which;
      if (keyCode == 87)
          zspeed = 0;
      else if (keyCode == 83)
          zspeed = 0;
      else if (keyCode == 65)
          xspeed = 0;
      else if (keyCode == 68)
          xspeed = 0;
  }
}

function gameStart(){
  if(!booted){
    document.addEventListener('keydown', onClick, false);
    document.addEventListener('keyup', onStop, false);  
    
    envinit();
    shipinit();

    for (i = 0; i < 10; i++) {
        enemyinit(i);
        pupinit(i);
    }
    loop();
  }
}

document.querySelector('#play').addEventListener('click', gameStart);


/*
window.onscroll = function(ev) {
  console.log('Scroll height:' + document.body.scrollHeight);
  console.log(window.innerHeight + window.scrollY)
  if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
      //alert("you're at the bottom of the page");
      if(!booted){
        booted = true;
        gameStart();
      } 
  }
};
*/

/*
document.addEventListener('DOMContentLoaded', function(e) {
  document.addEventListener('scroll', function(e) {
      let documentHeight = document.body.scrollHeight;
      let currentScroll = window.scrollY + window.innerHeight;
      // When the user is [modifier]px from the bottom, fire the event.
      let modifier = 200; 
      if(currentScroll + modifier > documentHeight) {
        if(!booted){
          booted = true;
          gameStart();
        } 
      }
  })
})
*/