import * as THREE from "three"; 
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight-107);

document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x040d21)

var camera = new THREE.PerspectiveCamera();
camera.aspect = window.innerWidth/(window.innerHeight-107);
camera.updateProjectionMatrix();
camera.position.set(10,8,10)

var light = new THREE.DirectionalLight(0xffffff, 0.5);
light.position.set(2,3,4)
light.name = "DIRECTIONAL_LIGHT"
scene.add(light);

var orbit = new OrbitControls(camera,renderer.domElement)
orbit.enablePan = false;
orbit.enableZoom = false;
orbit.enableRotate = false;

scene.add(camera)

class Box{
    constructor(x,y,z,r){
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
    }

    generate = function(){
        var boxes = [];
        for(let i=-1;i<2;i++){
            for(let j=-1;j<2;j++){
                for(let k=-1;k<2;k++){
                    let sum=0;
                    sum+= Math.abs(i)+Math.abs(j)+Math.abs(k);
                    if(sum>1){
                        var newR = this.r/3;
                        var b = new Box(this.x+newR*i,this.y+newR*j,this.z+newR*k,newR)
                        boxes.push(b);
                        var mat= new THREE.MeshStandardMaterial({ color: 0xfdfe03 });
                        var geom = new THREE.BoxGeometry(newR,newR,newR);
                        var mesh = new THREE.Mesh(geom,mat)
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        mesh.position.set(this.x+(newR*i),this.y+(newR*j),this.z+(newR*k))
                        scene.add(mesh)
                    }
                }
            }
        }
        return boxes;
    }
}

var sponge = [];
var bx = new Box(3,3,3,3);
sponge.push(bx);

window.addEventListener('keydown',(e)=>{
    e.preventDefault();
    if(e.key == " "){
        var i = scene.children.length-1;
        while(i >= 0){ 
            if(scene.children[i].name!="DIRECTIONAL_LIGHT"){
                scene.remove(scene.children[i]);
            }
            i--;
        }
        var next = [];
        sponge.forEach((cube)=>{
            var newBoxes = cube.generate();
            next.push.apply(next,newBoxes)
        })
        sponge = next;
    }
})

window.addEventListener('resize',()=>{
    camera.aspect = window.innerWidth/(window.innerHeight-107);
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,(window.innerHeight-107));
})

function animate(){
    orbit.update();
    renderer.render(scene,camera);
    requestAnimationFrame(animate)
}

animate();