'use strict';
window.VC={};
(() => {
 const G=VC,T=THREE;
 G.scene=new T.Scene();G.scene.background=new T.Color('#71bcd3');G.scene.fog=new T.Fog('#90cbd5',190,650);
 G.renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});G.renderer.setPixelRatio(Math.min(devicePixelRatio,1));G.renderer.shadowMap.enabled=true;G.renderer.shadowMap.type=T.PCFShadowMap;G.renderer.outputEncoding=T.sRGBEncoding;G.renderer.toneMapping=T.ACESFilmicToneMapping;G.renderer.toneMappingExposure=1.18;document.querySelector('#world').appendChild(G.renderer.domElement);
 G.camera=new T.PerspectiveCamera(60,1,.1,1200);G.scene.add(new T.HemisphereLight(0xb6e7ff,0x82613d,.85));
 const sun=new T.DirectionalLight(0xffdeb1,1.7);sun.position.set(-80,150,60);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-150,right:150,top:150,bottom:-150,near:1,far:400});sun.shadow.bias=-.0005;G.scene.add(sun);G.sun=sun;G.scene.add(sun.target);
 const materials=new Map();G.mat=(color,rough=.75,metal=0)=>{const key=color+':'+rough+':'+metal;if(!materials.has(key))materials.set(key,new T.MeshStandardMaterial({color,roughness:rough,metalness:metal}));return materials.get(key)};
 G.box=(w,h,d,color,x=0,y=0,z=0,parent=G.scene)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),typeof color==='object'?color:G.mat(color));m.position.set(x,y,z);m.castShadow=h>5;m.receiveShadow=h>5;parent.add(m);return m};
 G.cylinder=(r1,r2,h,color,x,y,z,parent=G.scene,n=10)=>{const m=new T.Mesh(new T.CylinderGeometry(r1,r2,h,n),G.mat(color));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m};
 G.sign=(text,w,h,color='#fff0cb',bg='#174856')=>{const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,512,128);ctx.fillStyle=color;ctx.font='bold 46px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,65,480);const tex=new T.CanvasTexture(c);tex.encoding=T.sRGBEncoding;const group=new T.Group();const mat=new T.MeshBasicMaterial({map:tex,side:T.FrontSide});for(const a of [0,Math.PI]){const p=new T.Mesh(new T.PlaneGeometry(w,h),mat);p.rotation.y=a;p.position.z=a===0?.025:-.025;group.add(p)}return group};
 G.resize=()=>{const w=innerWidth,h=innerHeight-78;G.renderer.setSize(w,h);G.camera.aspect=w/h;G.camera.updateProjectionMatrix()};addEventListener('resize',G.resize);G.resize();
 G.cameraYaw=0;G.cameraPitch=.18;G.cameraReady=false;
 G.updateCamera=(dt)=>{const p=G.player,c=p.car;const a=(c?c.angle:p.angle)+G.cameraYaw;const dist=c?9.2:6.5;const target=new T.Vector3(p.x, c?1.2:1.35,p.z);const desired=new T.Vector3(p.x-Math.sin(a)*dist, (c?4.4:3.9)+G.cameraPitch*7,p.z-Math.cos(a)*dist);if(!G.cameraReady){G.camera.position.copy(desired);G.cameraReady=true}else G.camera.position.lerp(desired,1-Math.exp(-dt*7));G.camera.lookAt(target.add(new T.Vector3(Math.sin(a)*4,0,Math.cos(a)*4)));G.sun.position.set(p.x-80,150,p.z+60);G.sun.target.position.set(p.x,0,p.z)};
})();
