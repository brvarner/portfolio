import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import "@fontsource/dm-serif-display";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.9,
  2000
);

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});

const onProgress = function (xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = (xhr.loaded / xhr.total) * 100;
    console.log(Math.round(percentComplete, 2) + "% downloaded");
  }
};

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(-5);
camera.position.setY(55);
camera.position.setX(15);

// const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshStandardMaterial({
//   color: 0xff6347,
// });
// const torus = new THREE.Mesh(geometry, material);

// scene.add(torus);

new MTLLoader().load("/assets/tree/p_p.mtl", function (materials) {
  materials.preload();
  new OBJLoader().setMaterials(materials).load(
    "/assets/tree/prunus_persica.obj",
    function (object) {
      scene.add(object);
    },
    onProgress
  );
});

new MTLLoader().load(
  "/assets/grass/grass.mtl",
  function (materials) {
    materials.preload();
    new OBJLoader()
      .setMaterials(materials)
      .load("/assets/grass/grass.obj", function (object) {
        object.scale.set(0.9, 0.1, 0.1)
        object.position.set(2, 0, 0);
        scene.add(object);
      });
  }
);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.position.set(20, 20, 20);

scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
const starSphere = new THREE.SphereGeometry(0.25, 24, 24);
const starMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

function addStar() {
  const star = new THREE.Mesh(starSphere, starMat);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load("/assets/space.jpg");
scene.background = spaceTexture;

const brandonTexture = new THREE.TextureLoader().load("/assets/brandon.jpg");

const brandon = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: brandonTexture })
);
brandon.position.set(0, 50, 0);
scene.add(brandon);

const moonTexture = new THREE.TextureLoader().load("/assets/moon.jpg");
const normalTexture = new THREE.TextureLoader().load("/assets/normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);
moon.position.setY(50);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  brandon.rotation.y += 0.01;
  brandon.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix;
  renderer.setSize(window.innerWidth, window.innerHeight);
});
