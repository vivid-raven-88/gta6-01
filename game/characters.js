'use strict';
(() => {
 const G=VC,T=THREE;G.pedestrians=[];G.enemies=[];
 G.character=(shirt='#1b787f',skin='#c48c65')=>{const g=new T.Group();G.box(.7,.85,.4,shirt,0,1.2,0,g);G.box(.43,.46,.43,skin,0,1.89,0,g);G.box(.46,.13,.45,'#26343c',0,2.12,-.02,g);const limbs=[];for(const s of [-1,1]){limbs.push(G.box(.24,.8,.25,'#233c53',s*.22,.43,0,g));G.box(.23,.65,.23,skin,s*.48,1.22,0,g);G.box(.27,.16,.45,'#e6d3b0',s*.22,.1,.1,g)}g.userData.limbs=limbs;return g};
 const mesh=G.character('#e4784e');G.scene.add(mesh);G.player={x:4,z:32,angle:Math.PI,health:100,cash:350,ammo:72,mesh,car:null};
 for(let i=0;i<28;i++){const r=G.roads[i%7],x=r+(i%2?13:-13),z=-234+G.random()*468;const m=G.character(['#debf65','#a64e69','#2c8385','#eea07c'][i%4],['#a76d4f','#d6a477','#8e604b'][i%3]);m.position.set(x,0,z);G.scene.add(m);G.pedestrians.push({mesh:m,x,z,dir:i%2?1:-1,speed:.8+G.random(),panic:0})}
 G.spawnGuard=(x,z)=>{const m=G.character('#592f55');m.position.set(x,0,z);G.scene.add(m);const e={mesh:m,x,z,hp:3,cooldown:2};G.enemies.push(e);return e};
 G.updatePeople=(dt,time)=>{for(const p of G.pedestrians){p.panic=Math.max(0,p.panic-dt);p.z+=p.dir*p.speed*(p.panic>0?3:1)*dt;if(Math.abs(p.z)>245)p.dir*=-1;p.mesh.position.set(p.x,0,p.z);p.mesh.rotation.y=p.dir>0?0:Math.PI;for(let i=0;i<2;i++)p.mesh.userData.limbs[i].rotation.x=Math.sin(time*7+i*Math.PI)*.4}
 for(const e of G.enemies){if(e.hp<=0)continue;const p=G.player,d=Math.hypot(e.x-p.x,e.z-p.z);e.mesh.rotation.y=Math.atan2(p.x-e.x,p.z-e.z);if(d<40){e.cooldown-=dt;if(e.cooldown<0){e.cooldown=1.5;G.trace(e.x,1.5,e.z,p.x,1,p.z,'#ff6848');if(d<22)p.health-=p.car?2:6}}}
 };
 G.updatePlayer=(dt,time)=>{const p=G.player,k=G.keys;const f=(k.KeyW||k.ArrowUp?1:0)-(k.KeyS||k.ArrowDown?1:0),s=(k.KeyA||k.ArrowLeft?1:0)-(k.KeyD||k.ArrowRight?1:0);
 if(p.car){G.moveCar(p.car,dt,f,s,!!k.Space,!!k.ShiftLeft);p.x=p.car.x;p.z=p.car.z;p.angle=p.car.angle;if(p.car.health<=0){p.car.speed=0;p.health-=dt*8;G.say('Inez: This engine is finished. Find another ride.')}}else{p.angle+=s*dt*2.5;const a=p.angle+G.cameraYaw;const v=(k.ShiftLeft?9:5)*f*dt;const x=p.x+Math.sin(a)*v,z=p.z+Math.cos(a)*v;if(!G.blocked(x,z)){p.x=x;p.z=z}p.mesh.position.set(p.x,0,p.z);p.mesh.rotation.y=a;for(let i=0;i<2;i++)p.mesh.userData.limbs[i].rotation.x=f?Math.sin(time*11+i*Math.PI)*.65:0}
 if(p.health<=0){p.health=100;p.cash=Math.max(0,p.cash-150);p.car=null;p.mesh.visible=true;p.x=4;p.z=32;G.heat=0;G.say('Sera: Patched you up. The clinic took $150. The job is still on.');G.save()}
 };
})();
