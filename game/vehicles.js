'use strict';
(() => {
 const G=VC,T=THREE;G.cars=[];
 G.createCar=(x,z,color='#ed6747',angle=0,police=false)=>{const g=new T.Group();g.position.set(x,0,z);g.rotation.y=angle;G.scene.add(g);
  G.box(2.35,.65,4.7,G.mat(color,.3,.35),0,.85,0,g);G.box(2.25,.25,4.5,color,0,1.25,0,g);G.box(1.95,.74,2.35,'#143d50',0,1.67,-.18,g);G.box(2.03,.12,2.4,color,0,2.08,-.18,g);
  for(const s of [-1,1]){G.box(.12,.8,.13,color,s*.99,1.7,.94,g);G.box(.12,.8,.15,color,s*.99,1.7,-1.3,g);G.box(.1,.75,.12,color,s*1.01,1.7,-.25,g);G.box(.3,.18,.4,color,s*1.3,1.4,.8,g);G.box(.65,.22,.08,'#fff1bb',s*.73,1.04,2.37,g);G.box(.6,.19,.08,'#d33437',s*.75,1,-2.37,g);G.box(.07,.06,.35,'#e3d7ba',s*1.2,1.17,-.5,g)}
  G.box(2.3,.18,.18,'#d0d6ce',0,.55,2.36,g);G.box(2.3,.18,.18,'#d0d6ce',0,.55,-2.36,g);G.box(.7,.2,.05,'#f8dfac',0,.8,-2.48,g);
  const wheels=[];for(const x1 of [-1.16,1.16])for(const z1 of [-1.48,1.48]){const m=G.cylinder(.47,.47,.25,'#182b35',x1,.5,z1,g,16);m.rotation.z=Math.PI/2;wheels.push(m);const hub=G.cylinder(.25,.25,.27,'#b2bdbe',x1,.5,z1,g,12);hub.rotation.z=Math.PI/2}
  let lights=[];if(police){G.box(2.4,.5,2.8,'#ede4d1',0,1.02,-.2,g);G.box(1.5,.12,.45,'#203b4d',0,2.22,-.1,g);for(const [x1,c]of [[-.5,'#157bff'],[.5,'#fa3542']]){const m=G.box(.6,.2,.4,new T.MeshBasicMaterial({color:c}),x1,2.4,-.1,g);lights.push(m)}}
  const c={mesh:g,x,z,angle,speed:0,health:100,color,police,wheels,lights,ai:false,stolen:false};G.cars.push(c);return c;
 };
 G.moveCar=(c,dt,throttle,steer,brake=false,boost=false)=>{const oldX=c.x,oldZ=c.z;const max=boost?39:29;c.speed+=throttle*(boost?20:13)*dt;c.speed*=Math.exp(-dt*(brake?4.5:throttle?.22:1));c.speed=Math.max(-10,Math.min(max,c.speed));c.angle+=steer*Math.min(1,Math.abs(c.speed)/6)*dt*1.5*(c.speed<0?-1:1);c.x+=Math.sin(c.angle)*c.speed*dt;c.z+=Math.cos(c.angle)*c.speed*dt;
 if(G.blocked(c.x,c.z,1.35)){c.x=oldX;c.z=oldZ;if(Math.abs(c.speed)>6){c.health-=Math.abs(c.speed)*.7;if(c===G.player?.car)G.sound.effect('crash')}c.speed*=-.28}
 c.mesh.position.set(c.x,.04,c.z);c.mesh.rotation.y=c.angle;for(const w of c.wheels)w.rotation.x+=c.speed*dt*1.7;
 };
 G.enterExit=()=>{const p=G.player;if(p.car){if(Math.abs(p.car.speed)>11){G.say('Inez: Slow down before you jump out.');return}p.x=p.car.x+Math.cos(p.car.angle)*2.7;p.z=p.car.z-Math.sin(p.car.angle)*2.7;p.angle=p.car.angle;p.car=null;p.mesh.visible=true;G.sound.effect('door');return}
 const c=G.cars.filter(c=>!c.police&&c.health>0).sort((a,b)=>Math.hypot(a.x-p.x,a.z-p.z)-Math.hypot(b.x-p.x,b.z-p.z))[0];if(c&&Math.hypot(c.x-p.x,c.z-p.z)<5){p.car=c;c.ai=false;p.mesh.visible=false;G.cameraYaw=0;if(!c.stolen){c.stolen=true;G.addHeat(.8);G.say('Inez: Borrowed wheels. I will worry about the owner later.')}G.sound.effect('door')}else G.say('Inez: Get closer to a car, then press E.');
 };
})();
